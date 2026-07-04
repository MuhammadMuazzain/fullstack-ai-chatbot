import Axios from "axios";
import { config } from "../config";

export const axios = Axios.create({
  baseURL: config.apiUrl,
});
