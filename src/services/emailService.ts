import emailjs from '@emailjs/browser';

// EmailJS configuration - replace with your actual values
// To configure: Go to src/components/settings/EmailSettings.tsx
const EMAIL_CONFIG = {
  serviceId: 'service_iiif97n', // Get from EmailJS dashboard
  templateId: 'template_x02gg6d', // Get from EmailJS dashboard  
  publicKey: 'YFadarA7IGC-KoqKH' // Get from EmailJS dashboard
};

export interface EmailParams {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  from_name?: string;
  from_email?: string;
}

export const initializeEmailJS = () => {
  emailjs.init(EMAIL_CONFIG.publicKey);
};

export const sendEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: params.to_email,
      to_name: params.to_name,
      subject: params.subject,
      message: params.message,
      from_name: params.from_name || 'Techno Platform',
      from_email: params.from_email || 'noreply@techno.com'
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams
    );

    return response.status === 200;
  } catch (error) {
    console.error('EmailJS Error:', error);
    return false;
  }
};

export const sendBulkEmails = async (
  recipients: Array<{email: string; name: string}>,
  subject: string,
  content: string
): Promise<{success: number; failed: number}> => {
  let success = 0;
  let failed = 0;
  
  // Process emails in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const promises = batch.map(async (recipient) => {
      const emailParams: EmailParams = {
        to_email: recipient.email,
        to_name: recipient.name,
        subject: subject,
        message: content.replace('{name}', recipient.name)
      };
      
      const result = await sendEmail(emailParams);
      return result ? 'success' : 'failed';
    });
    
    const results = await Promise.all(promises);
    success += results.filter(r => r === 'success').length;
    failed += results.filter(r => r === 'failed').length;
    
    // Add delay between batches
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return { success, failed };
};