// "JDX000221377866-1-1-"
(function () {
  function getTime() {
    const date = new Date();
    let h = date.getHours();
    if (h <= 9) {
      h = '0' + h;
    }
    let m = date.getMinutes();
    if (m <= 9) {
      m = '0' + m;
    }
    let s = date.getSeconds();
    if (s <= 9) {
      s = '0' + s;
    }
    return h + ':' + m + ':' + s;
  }
  function getQueryString() {
    var url = location.search; //获取url中"?"符后的字串
    var therequestV1 = new Object();
    if (url.indexOf('?') != -1) {
      var str = url.substr(1);
      strs = str.split('&');
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
    }
    return theRequest;
  }

  window.onload = function () {
    const query = getQueryString();
    const instance = axios.create();
    instance.interceptors.request.use((config) => {
      if (query.code) {
        if (config.params) {
          config.params.code = query.code;
          config.params.state = query.state;
        } else {
          config.params = {
            code: query.code,
            state: query.state,
          };
        }
      }
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      config.headers['callback'] = location.origin + location.pathname + location.search;
      return config;
    });
    instance.interceptors.response.use(
      function (res) {
        if (res.data && typeof res.data.code !== 'undefined') {
          const code = res.data.code;
          console.log(code);
          switch (code) {
            case 200:
            case '200':
              return res;
            case 401:
              if (res.config._autoRedirect !== false) {
                window.location.replace(
                  `${res.data.data.loginURL}?ReturnUrl=${encodeURIComponent(location.href)}`,
                );
              }
              return res;
            default:
              console.log(res.data.message);
              return Promise.reject({ message: res.data.message });
          }
        }
        return res;
      },
      function (error) {
        const response = error.response;
        if (response.status === 401) {
          const targetUrl = response.headers.location;
          if (targetUrl) {
            return (location.href = targetUrl);
          }
        }
        return Promise.reject(error);
      },
    );
    Vue.createApp({
      data() {
        const data = {
          form: {
            packageCode: '',
            sourceSiteId: '',
          },
          codesCache: [],
          codeCache: '',
          url: 'ws://localhost:9113/view',
          // 打印机名称
          printName: '',
          printList: [],
          // 组件链接状态
          state: 0,
          // 状态枚举
          stateMap: {
            0: '正在连接',
            1: '已建立连接',
            2: '正在关闭连接',
            3: '已关闭连接',
          },
          message: [],
          responseText: '',
          cache: '{"orderType":"GET_Version"}',
          errorMessage: '',
          nickname: '',
        };
        const printName = localStorage.getItem('add-print/printName');
        if (printName) {
          data.printName = printName;
          data.printList = [printName];
        }
        return data;
      },
      mounted() {
        this.getUserInfo(false);
      },
      methods: {
        onLogin() {
          this.getUserInfo();
        },
        getUserInfo(autoRedirect) {
          const query = getQueryString();
          instance({
            method: 'get',
            url: '/api/auth/user/current?&sso_service_ticket=' + (query.sso_service_ticket || ''),
            _autoRedirect: autoRedirect,
          }).then((response) => {
            const nickname = response.data.data.nickname;
            this.nickname = nickname;
          });
        },
        // 连接
        onConnect() {
          this.toast('开始链接打印组件');
          if (this.socket) {
            try {
              if (this.socket.readyState === 1) {
                this.toast('socket链接已建立');
              }
            } catch (e) {
              this.createSocket();
            }
          } else {
            this.createSocket();
          }
        },
        onOpen() {
          this.toast('链接成功');
          this.refreshState();
          if (this.cache && this.printName) {
            this.socket.send(this.cache);
            this.cache = '{"orderType":"GET_Version"}';
          } else {
            this.toast('请选择打印机');
            this.cache = '{"orderType":"GET_Version"}';
          }
          this.getPrints();
        },
        onMessage(e) {
          try {
            console.log(e);
            let data = e.data;
            if (data) {
              this.dataHandler(data);
            } else {
              this.toast('E:组件返回数据不存在');
            }
          } catch (error) {
            console.log('error', error);
            this.toast('E:组件返回数据解析错误');
          }
          this.refreshState();
        },
        onError(err) {
          this.toast('E:链接失败：' + (err || {}).message || '');
        },
        onClose() {
          this.toast('E:链接断开');
          this.createSocket();
        },
        onPrintChange() {
          if (this.printName) {
            localStorage.setItem('add-print/printName', this.printName);
          }
        },
        refreshState() {
          try {
            this.toast('刷新链接状态：' + this.stateMap[this.socket.readyState]);
            this.state = this.socket.readyState;
          } catch (e) {
            console.log('链接状态获取失败', e);
          }
        },
        createSocket() {
          this.toast('创建soket链接：' + this.url);
          const socket = new WebSocket(this.url);
          socket.onopen = this.onOpen;
          socket.onmessage = this.onMessage;
          socket.onerror = this.onError;
          socket.onclose = this.onClose;
          this.socket = socket;
        },
        getPrints() {
          this.toast('获取打印机列表');
          this.socket.send('{"orderType":"GET_Printers"}');
        },
        onPrint() {
          const code = this.form.packageCode;
          if (!code) {
            this.errorMessage = '未填写包裹号';
            return this.toast('E:未填写包裹号');
          }
          if (!/.+-[0-9]+-[0-9]+-/.test(code)) {
            this.errorMessage = '包裹号格式不正确';
            return this.toast('E:包裹号格式不正确');
          }
          try {
            this.codesCache.unshift(code);
            if (this.codesCache.length > 5) {
              this.codesCache.length = 5;
            }
            this.codeCache = this.codesCache.join('、');
          } catch (e) {
            console.log('缓存错误', e);
          }
          this.form.packageCode = '';
          this.toast('发送请求:' + code);
          let url =
            '/api/render/rePrint?packageCode=' +
            code +
            '&sourceSiteId=' +
            (this.form.sourceSiteId || '');
          if (query.sso_service_ticket) {
            url =
              '/api/render/rePrint?packageCode=' +
              code +
              '&sourceSiteId=' +
              (this.form.sourceSiteId || '') +
              '&sso_service_ticket=' +
              query.sso_service_ticket;
          }
          this.refreshState();
          instance({
            url: url,
            method: 'get',
          })
            .then((response) => {
              this.toast('请求成功');
              this.errorMessage = '';
              console.log(response);
              this.sendData(response.data);
            })
            .catch((error) => {
              this.toast('E:请求失败');
              this.errorMessage = '获取数据失败' + ((error || {}).message || '');
              this.toast(error.message);
            });
        },
        sendData(data) {
          this.toast('开始解析请求数据');
          try {
            const printData = data.data.rePrintData.printData;
            const templateCode = data.data.templateCode;
            const inArgs = JSON.stringify({
              operator: 'DB',
              templateCode: templateCode,
              printData: [
                {
                  orderNumber: data.data.rePrintData.waybillCode,
                  customizedPrintData: printData,
                },
              ],
              appKey: 'DB',
              taskID: Date.now().toString().slice(-20),
              outputConfig: [
                {
                  outputType: 0,
                  printerName: this.printName,
                },
              ],
            });
            console.log(inArgs);
            if (this.socket && this.socket.readyState === 1) {
              this.socket.send(inArgs);
            } else {
              this.cache = inArgs;
              this.createSocket();
            }
          } catch (e) {
            console.log(e);
            this.toast('E:解析数据失败');
          }
        },
        dataHandler(data) {
          data = JSON.parse(data);
          switch (data.code) {
            // 打印机列表
            case '6':
              if (data.content) {
                this.printList = data.content.split(',') || [];
              } else {
                this.toast('查询不到打印机');
              }
              break;
            case 200:
              this.responseText = JSON.stringify(data, undefined, 2);
              this.toast('P:打印成功');
              this.errorMessage = '';
              break;
            default:
              this.responseText = JSON.stringify(data, undefined, 2);
              this.errorMessage = data.message;
              this.toast('E:预料之外的数据返回');
              break;
          }
        },
        toast(str = '') {
          const time = getTime();
          this.message.unshift(time + ' ' + str);
          if (this.message.length >= 200) {
            this.message.length = 200;
          }
        },
      },
    }).mount('#app');
  };
})();
