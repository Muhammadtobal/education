interface GqlRequest {
  headers: {
    'account-type': string;
    authorization?: string;
    'req-id'?: string;
  };
  user:
    | { userId: string }
    | { teacherId: string }
    | {
        empId: string;
      };
  body: { query: string };
}

export interface GqlContext {
  req: GqlRequest;
}
