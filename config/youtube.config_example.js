const keys = require('../keys.json');
const YOUTUBE_API_KEY = 'API_KEY';

const port = 3000;
const baseUrl = `http://localhost:${port}`;
const urlencodedBaseURL = 'http%3A%2F%2Flocalhost%3A3000%2FOAuth'

module.exports = {
    ACCESS_TOKEN_SECRET: 'SECRET_TOKEN',

    REFRESH_TOKEN_SECRET: 'SECRET_REFRESH_TOKEN',

    baseUrl: baseUrl,
    urlencodedBaseURL: urlencodedBaseURL,
    port: port,

    oauth2Credentials: {
        client_id: keys.web.client_id,
        project_id: keys.web.project_id,
        auth_uri: keys.web.auth_uri,
        token_uri: keys.web.token_uri,
        auth_provider_x509_cert_url: keys.web.auth_provider_x509_cert_url,
        client_secret: keys.web.client_secret,
        redirect_uris: [
            keys.web.redirect_uris[0]
        ],
        scopes: [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
    }
}