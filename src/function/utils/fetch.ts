import { ExecutorFunction } from "../base";

export type FetchInput = {
    url: string;
    method?: string;
    data?: any;
    responseType ?: 'json' | 'text';
};

export class FetchFunction extends ExecutorFunction<FetchInput, any> {
    constructor() {
        super('utils.fetch');
    }

    async execute(input: FetchInput): Promise<any> {
        try {
            const options: RequestInit = {
                method: input.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            if (input.data) {
                options.body = JSON.stringify(input.data);
            }
            const response = await fetch(input.url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (input.responseType === 'json') {
                return await response.json();
            }
            return await response.text();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
}
