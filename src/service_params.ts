/**
 * Created by pedrosousabarreto@gmail.com on 15/Jan/2019.
 */
"use strict";

import * as path from "path";
import {strEnum} from "./string_utils";
import {AppBaseConfigs} from "./service_configs";

export const PARAM_TYPES = strEnum([
	'STRING',
	'BOOL',
	'INT_NUMBER',
	'FLOAT_NUMBER'
]);

/** type from string enum */
export type ParamType = keyof typeof PARAM_TYPES;

/***
 * ServiceParams
 * An instance of this class is required to configure a service.
 * This will act like the schema of available of parameters and feature flags for a service.
 */

export class ServiceParams{
	private _params:Map<string, ServiceParam>;
	private _feature_flags:Map<string, ServiceFeatureFlag>;
	private _secrets:Map<string, ServiceSecret>;

	constructor(){
		this._params = new Map<string, ServiceParam>();
		this._feature_flags = new Map<string, ServiceFeatureFlag>();
		this._secrets = new Map<string, ServiceSecret>();
	}

	add_param(srv_opt:ServiceParam){
		this._params.set(srv_opt.name, srv_opt);
	}

	get_param(param_name:string):ServiceParam | null{
		return this._params.get(param_name) || null;
	}

	get_all_params():Array<ServiceParam>{
		return Array.from(this._params.values());
	}

	add_feature_flag(feature_flag:ServiceFeatureFlag){
		this._feature_flags.set(feature_flag.name.toUpperCase(), feature_flag);
	}

	get_feature_flag(feature_flag_name:string):ServiceFeatureFlag | null{
		return this._feature_flags.get(feature_flag_name.toUpperCase()) || null;
	}

	get_all_feature_flags():Array<ServiceFeatureFlag>{
		return Array.from(this._feature_flags.values());
	}

	get_all_secrets():Array<ServiceSecret>{
		return Array.from(this._secrets.values());
	}

	add_secret(secret:ServiceSecret){
		this._secrets.set(secret.name, secret);
	}

	get_secret(secret_name:string):ServiceSecret | null{
		return this._secrets.get(secret_name) || null;
	}

	// this will update the passed
	public override_from_env_file(base_config_path:string, app_base_confs:AppBaseConfigs):void{
		const filename = path.resolve(base_config_path, "params." + app_base_confs.env + ".js");
		// if(process.env.hasOwnProperty("LOCAL_OVERRIDES")){
			try{
				require(filename)(app_base_confs, this);
				console.info(`ENV VAR name based param file LOADED from path: ${filename}`);
			} catch(e){
				console.info(`ENV VAR name based param file NOT FOUND in path: ${filename}`);
			}
		// }
	}

}

export class ServiceParam{
	constructor(private _name:string, private _type:ParamType, private _default_value:any, private _description:string){}

	get name():string{ return this._name;}
	get type():ParamType{ return this._type;}
	get default_value():any{ return this._default_value;}
	get description():string{ return this._description;}
}

export class ServiceFeatureFlag{
	constructor(private _name:string, private _default_value:boolean, private _description:string){}

	get name():string{ return this._name; }
	get default_value():boolean{ return this._default_value; }
	get description():string{ return this._description; }
}

export class ServiceSecret{
	constructor(private _name:string, private _default_value:string | null, private _description:string){}

	get name():string{ return this._name; }
	get default_value():string|null{ return this._default_value; }
	get description():string{ return this._description; }
}


