import {
  ActionContext,
  ActionTree,
  GetterTree,
  MutationTree,
  Store,
} from "vuex";

export type Issue = {
  title: string;
  isOpen: boolean;
  createdAt: Date;
};

export type State = {
  issues: Issue[];
};

export type Getters = {
  issues(state: State): Issue[];
};

export type ActionAugments = Omit<ActionContext<State, State>, "commit"> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
};

export enum ActionType {
  SubmitIssue = "SubmitIssue",
}

export type Actions = {
  [ActionType.SubmitIssue](
    context: ActionAugments,
    submitIssuePayload: SubmitIssuePayload
  ): void;
};

export type SubmitIssuePayload = {
  issueTitle: string;
};

export enum MutationType {
  SubmitIssue = "SUBMIT_ISSUE",
}

export type Mutations = {
  [MutationType.SubmitIssue](state: State, payload: SubmitIssuePayload): void;
};

const state: State = {
  issues: [],
};

const getters: GetterTree<State, State> & Getters = {
  issues: function (state: State): Issue[] {
    return state.issues;
  },
};

const actions: ActionTree<State, State> & Actions = {
  [ActionType.SubmitIssue]: function (
    { commit }: ActionAugments,
    { issueTitle }: SubmitIssuePayload
  ): void {
    commit(MutationType.SubmitIssue, { issueTitle });
  },
};

const mutations: MutationTree<State> & Mutations = {
  [MutationType.SubmitIssue]: function (
    state: State,
    { issueTitle }: SubmitIssuePayload
  ): void {
    const issue: Issue = {
      title: issueTitle,
      isOpen: true,
      createdAt: new Date(),
    };

    state.issues.push(issue);
  },
};
