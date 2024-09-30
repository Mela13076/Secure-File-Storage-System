import jwtDecode from 'jwt-decode';


const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
};

const token = localStorage.getItem('authToken');
if (token && isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
}