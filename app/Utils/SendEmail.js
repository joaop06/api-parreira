const nodemailer = require('nodemailer')

class SendEmail {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: process.env.MAILER_SERVICE,
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            secure: false, // true for 465, false for others ports
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            }
        })
    }

    async sendMail(config) {
        // const { to, subject, html, attachments } = config

        const resutl = await this.transport.sendMail({
            from: {
                name: 'Api Parreira',
                address: process.env.MAILER_EMAIL
            },
            ...config
        })

        return resutl
    }



    static messageToSendEmail(nameUser, token) {
        return `<!DOCTYPE html>
        <html lang="pt-br">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperação de Senha</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background-color: #f4f4f4;
                }
        
                .banner {
                    max-width: 400px;
                    text-align: center;
                    padding: 20px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                }
        
                h2 {
                    color: #333;
                }
        
                p {
                    color: #666;
                    margin-bottom: 20px;
                }
        
                form {
                    display: flex;
                    flex-direction: column;
                }
        
                label {
                    text-align: left;
                    margin-bottom: 5px;
                    color: #333;
                }
        
                input {
                    padding: 10px;
                    margin-bottom: 15px;
                    width: 100%;
                    box-sizing: border-box;
                }
        
                button {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 15px;
                }
        
                button:hover {
                    background-color: #0056b3;
                }
        
                a {
                    text-decoration: none;
                    color: white;
                }
        
                request_again {
                    text-decoration: double;
                }
            </style>
        </head>
        
        <body>
            <div class="banner">
                <h2>Recuperação de Senha</h2>
                <p>
                    Olá, ${nameUser.toUpperCase()}!<br />
                    Você será redirecionado a tela de Redefinição de Senha. O link de recuperação expirará em 1 hora.
                </p>
        
                <button type="submit">
                    <a href="https://y74x2h-3000.csb.app/redefinir-senha/${token}" target="_blank">Redefinir Senha</a>
                </button>
            </div>
        </body>
        
        </html>`
    }

    static htmlPasswordChanged(nameUser, token, date, ip) {
        return `<!DOCTYPE html>
        <html lang="pt-BR">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Alteração de Senha</title>
            <style>
                body {
                    font-family: 'Helvetica', 'Arial', sans-serif;
                    font-size: 18px;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f8f8;
                    margin: 0;
                    padding: 20px;
                    text-align: center;
                }

                h1 {
                    font-size: 32px;
                    color: #007bff;
                    margin-top: 0;
                }

                p {
                    margin-bottom: 15px;
                }

                a {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 15px;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                }

                a:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>

        <body>
            <h1>Alteração de Senha</h1>

            <p>Prezado(a) ${nameUser.toUpperCase()},</p>

            <p>A senha da sua conta foi alterada com sucesso em ${date} pelo IP ${ip}.</p>

            <p>Se você não reconhece essa alteração, clique no link abaixo para redefinir sua senha imediatamente:</p>

            <a href="https://y74x2h-3000.csb.app/redefinir-senha/${token}">Redefinir senha</a>

            <p>Atenciosamente,</p>

            <p>Equipe Parreira</p>
        </body>

        </html>`
    }
}

module.exports = SendEmail