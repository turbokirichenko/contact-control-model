import { DefineModel } from "../plugins/htmodel";
import { modelConfig } from "../shared/config/model.config";

export const AppModel = DefineModel(modelConfig)(Object);