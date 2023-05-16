export interface IType {
  kind: string;
  name?: string;
  ofType: IType;
}

export interface IArgument {
  name: string;
  type: IType;
  defaultValue?: string;
}

export interface IField {
  name: string;
  args: IArgument[];
  type: IType;
  fields?: IField[];
}

export function getQueryFields() {
  return `
  query IntrospectionQuery {
    __schema {
      queryType {
        description
        kind
        name
      }        
    }
  }`;
}

export function getTypeSchema(type: string) {
  return `
    {
      __type(name: "${type}") {
        name
        kind
        description
        inputFields {
          name
          defaultValue
          type {
            description
            name
            kind
            ofType {
              description
              name
              kind
              ofType {
                description
                name
                kind
                ofType {
                  description
                  name
                  kind
                }
              }
            }
          }
        }
        fields {
          name
          args {
            description
            name
            type {
              description
              name
              kind
              ofType {
                description
                name
                kind
                ofType {
                  description
                  name
                  kind
                  ofType {
                    description
                    name
                    kind
                  }
                }
              }  
            }
          }
          type {
            description
            name
            kind
            ofType {
              description
              name
              kind
              ofType {
                description
                name
                kind
                ofType {
                  description
                  name
                  kind
                }
              }
            }
          }
        }
      }
    }
  `.replace(/  /g, '');
}
