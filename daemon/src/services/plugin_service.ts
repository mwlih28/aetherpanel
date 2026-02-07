import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

export class PluginService {
    static async searchPlugins(query: string) {
        // Using Modrinth API for searching
        const response = await axios.get(`https://api.modrinth.com/v2/search?query=${query}&facets=[["categories:spigot","categories:paper"]]`);
        return response.data;
    }

    static async installPlugin(serverId: string, pluginUrl: string, fileName: string) {
        const pluginsPath = path.join(process.cwd(), 'data', serverId, 'plugins');
        await fs.ensureDir(pluginsPath);

        const response = await axios({
            method: 'get',
            url: pluginUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(path.join(pluginsPath, fileName));
        (response.data as any).pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }
}
