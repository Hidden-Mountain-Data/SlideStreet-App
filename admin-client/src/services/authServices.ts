import axios from 'axios';

class AuthServices {
  private baseUrl = process.env.REACT_APP_API_URL + '/api/auth/';

  async login(username: string, password: string): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/login`, { username, password });

    if(response.status !== 200) {
      throw new Error('Failed to login');
    }

    return response.data;
  }

  async logout(): Promise<any> {
    const response = await axios.post(`${this.baseUrl}/logout`);

    if(response.status !== 200) {
      throw new Error('Failed to logout');
    }

    return response.data;
  }
}

export default AuthServices;
