// src/core/config/env.ts

import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
	PORT: get('PORT').required().asPortNumber(),
	API_PREFIX: get('DEFAULT_API_PREFIX').default('/api/v1').asString(),
	NODE_ENV: get('NODE_ENV').default('development').asString(),
	MONGO_INITDB_ROOT_USERNAME: get('MONGO_INITDB_ROOT_USERNAME').default('admin').asString(),
	MONGO_INITDB_ROOT_PASSWORD: get('MONGO_INITDB_ROOT_PASSWORD').default('test123').asString(),
	MONGO_DB_NAME: get('MONGO_DB_NAME').default('worketyamo').asString(),
};	

export const account = {
	USER: "kenwoubarthez@gmail.com",
	PASS: "vgtb djoo xrvp lvmm"
}

export const key = {
	ACCESS_TOKEN_SECRET : "1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZWQyNTUxOQAAACBQlEVL7yKEVbIIDWVhC2NdGQQx+6dudnwDZMCcdpotDgAAAKD3e+5c93vuXAAAAAtzc2gtZWQyNTUxOQAAACBQlEVL7yKEVbIIDWVhC2NdGQQx+6dudnwDZMCcdpotDgAAAEAOZZVvm+O+EI7mQH+tXUjzlpZLLD+nr1HAY3kezKBmeVCURUvvIoRVsggNZWELY10ZBDH7p252fANkwJx2mi0OAAAAF0JBUlRIRVpAREVTS1RPUC1DRlUzNUxWAQIDBAUG",
	REFRESH_TOKEN_SECRET : "b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZWQyNTUxOQAAACB7WattmkPJ8AB3+s9o/5NN36f0rJ2n83yRXISVMi5Y3wAAAKAb2cUXG9nFFwAAAAtzc2gtZWQyNTUxOQAAACB7WattmkPJ8AB3+s9o/5NN36f0rJ2n83yRXISVMi5Y3wAAAEA8cnrYMem6MtL2mwm6/My9G7ZtShSDg/lRuxuXitqssHtZq22aQ8nwAHf6z2j/k03fp/SsnafzfJFchJUyLljfAAAAF0JBUlRIRVpAREVTS1RPUC1DRlUzNUxWAQIDBAUG"	
}

export const CONNECTION_STRING = `mongodb://${envs.MONGO_INITDB_ROOT_USERNAME}:${envs.MONGO_INITDB_ROOT_PASSWORD}@172.28.0.2:27017/${envs.MONGO_DB_NAME}?authSource=admin`;
