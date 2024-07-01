#!/usr/bin/env bash

# 构建发布代码后，上传至发布代码远程仓库对应分支

# 当发生错误时中止脚本
set -e
current_dir=$(pwd)
# TODO 之后修改文件夹路径之后在处理
managePath=$current_dir
editorPath=/Users/liyankai6/Documents/projects/print/print-editor
ENV=

# 构建
echo "日志：检测管理端代码路径"

# 检测管理端代码路径
libPath=$(git remote -v)
if [[ $libPath =~ "print-manage.git" ]]; then
  echo "日志：执行路径验证通过"
else
  echo "日志：执行路径错误，请在usf-web项目根目录运行"
  exit 1
fi

# 检测编辑器代码路径
# echo "日志: 检测编辑器代码路径"
# cd $editorPath
# libPath=$(git remote -v)
# if [[ $libPath =~ "print-template/editor.git" ]]; then
#   echo "日志：目标路径验证通过"
# else
#   echo "日志：目标路径错误，请确认print-manage与print-editor处于同一父文件夹下， 例如a/print-manage、a/print-editor"
#   exit 1
# fi

# 打包编辑器
function buildEditor() {
  cd $editorPath
  # npm run build
  npx vue-cli-service build --mode $ENV
  echo "编辑器打包完成"
  cd ./dist
  mv ./index.html ./editor.html
  echo "编辑器文件名称修改完成"
  targetPath="${managePath}/public"
  echo "拷贝目标路径$targetPath"
  cp -r ./* ${targetPath}
  buildManage
  return 0
}

function buildManage() {
  cd $managePath
  # npm run build
  # npm run build_g
  npx vue-tsc --noEmit && npx vite build --mode $ENV
  echo "管理端打包完成"
  git fetch
  branchName=$(git branch | sed -n '/\* /s///p')
  echo "当前分支为:"
  echo $branchName
  read -p "是否确认请输入 y/n: " -t 30 result
  case $result in
  "y")
    git pull
    echo "日志：开始提交代码"
    git add .
    git commit -m "chore: build"
    git push origin $branchName:$branchName
    echo "日志：代码提交完成"
    ;;
  *)
    echo "停止执行"
    # TODO 是否部署测试环境
    # read -p "是否部署测试环境 y/n: " -t 30 resultT
    # if [ "y" = $resultT ]
    # then
    #   targetPath="${managePath}/dist/*"
    #   echo ${targetPath}
    #   scp -r "${managePath}/dist/*" root@11.91.148.62:/export/servers/nginx/html
    #   exit 0;
    # fi
    ;;
  esac
}

function chooseEnv() {
  # 选择打包形式
  echo "选择打包环境"
  options=("本地", "测试", "灰度", "生产", "退出")
  select option in "${options[@]}"; do
    case $REPLY in
    1)
      echo "本地"
      ENV=
      break
      ;;
    2)
      echo "测试"
      ENV=test
      break
      ;;
    3)
      echo "灰度"
      ENV=gray
      break
      ;;
    4)
      echo "生产"
      ENV=production
      break
      ;;
    *)
      echo "退出"
      continue
      ;;
    esac
  done
  echo "ENV"
  echo $ENV
  return 0
}

# 选择打包形式
echo "请输入数字选择打包形式："
options=("只打包管理端代码", "打包编辑器与管理端代码", "退出")
select option in "${options[@]}"; do
  case $REPLY in
  1)
    echo "只打包管理端代码"
    chooseEnv
    buildManage
    break
    ;;
  2)
    echo "打包编辑器与管理端代码"
    chooseEnv
    buildEditor
    exit 0
    ;;
  3)
    echo "退出"
    exit 0
    ;;
  *)
    echo "选择错误,你在好好想想"
    continue
    ;;
  esac
done
