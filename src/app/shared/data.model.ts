//#################################################//
//##### CUSTOM: datatype, classes, interfaces #####//
//#################################################//

//##### bank template
export type TypeBank = [string, string, string, number, number, string];

//##### notification interface
export interface TypeNotification {
  header: string;
  body: string;
}

//##### url type
export type TypeBankUrl = [string, string];

//##### zarka user type
export interface TypeUser {
  email: string;
  token: string;
}

//##### zarka user theme type
export interface TypeTheme {
  id?: string;
  email?: string;
  navbar: string;
  sidebar: string;
  button: string;
  tableTh: string;
  loader: string;
}

//##### chart dataset type
export interface TypeDatasetChart { 
    data?: any[],
    label?: string,
    borderColor?: string,
    backgroundColor?: string,
    borderWidth?: number,
    hoverBackgroundColor?: string
  }
