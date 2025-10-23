import { createContext } from "react";
import type { FormInstance } from "./type";

const formContext = createContext<FormInstance >({} as FormInstance);
export default formContext;
