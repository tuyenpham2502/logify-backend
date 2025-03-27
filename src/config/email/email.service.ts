import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class EmailService {
  private readonly templatesPath: string;
  private readonly appConfig = {
    logoUrl: 'https://logify.app/assets/logo.png',
    securityUrl: 'https://logify.app/account/security',
    companyAddress: 'Logify Inc., 123 Logger Street, Developer City, DC 12345',
  };

  constructor(private readonly mailerService: MailerService) {
    this.templatesPath = join(
      process.cwd(),
      'src',
      'config',
      'email',
      'templates',
    );
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({ to, subject, html });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string): Promise<boolean> {
    try {
      const templatePath = join(this.templatesPath, 'welcome.template.html');
      let template = await readFile(templatePath, 'utf8');

      template = template.replace(
        '${year}',
        new Date().getFullYear().toString(),
      );

      const subject = 'Welcome to Logify!';
      const result = await this.sendEmail(email, subject, template);
      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string,
  ): Promise<boolean> {
    try {
      const templatePath = join(
        this.templatesPath,
        'verify-email.template.html',
      );
      let template = await readFile(templatePath, 'utf8');

      const now = new Date();
      const replacements = {
        '{{verificationLink}}': verificationLink,
        '{{logoUrl}}': this.appConfig.logoUrl,
        '{{currentYear}}': now.getFullYear().toString(),
        '{{companyAddress}}': this.appConfig.companyAddress,
      };

      for (const [key, value] of Object.entries(replacements)) {
        template = template.replace(new RegExp(key, 'g'), value);
      }

      const subject = 'Verify Your Email - Logify';
      const result = await this.sendEmail(email, subject, template);
      return result;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }

  async sendWelcomeOAuthEmail(
    email: string,
    provider: string,
  ): Promise<boolean> {
    try {
      const templatePath = join(
        this.templatesPath,
        'welcome-oauth.template.html',
      );
      let template = await readFile(templatePath, 'utf8');

      const now = new Date();
      const loginTime = now.toLocaleString('en-US', {
        timeZone: 'UTC',
        timeZoneName: 'short',
      });

      const replacements = {
        '{{provider}}': provider,
        '{{loginTime}}': loginTime,
        '{{device}}': 'Web Browser',
        '{{location}}': 'Unknown Location',
        '{{logoUrl}}': this.appConfig.logoUrl,
        '{{securityUrl}}': this.appConfig.securityUrl,
        '{{currentYear}}': now.getFullYear().toString(),
        '{{companyAddress}}': this.appConfig.companyAddress,
      };

      for (const [key, value] of Object.entries(replacements)) {
        template = template.replace(new RegExp(key, 'g'), value);
      }

      const subject = `Welcome to Logify via ${provider}!`;
      const result = await this.sendEmail(email, subject, template);
      return result;
    } catch (error) {
      console.error('Error sending OAuth welcome email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<boolean> {
    const subject = 'Password Reset Request';
    const html = `
      <h1>Reset Your Password</h1>
      <p>You've requested to reset your password.</p>
      <p>Click the link below to set a new password:</p>
      <a href="https://logify.app/reset-password?token=${resetToken}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>The link will expire in 1 hour.</p>
    `;

    const result = await this.sendEmail(email, subject, html);
    return result;
  }
}
