import { get } from '@helper/fetch';

class API {
  /**
   * fetch some data
   */
  static async fetchSomeData() {
    const params = { time: Date.now() };
    const res = await get('/api.json', params);

    if (res.error) {
      console.log(res.error);
      return {};
    }

    return res;
  }
}

export default API;
