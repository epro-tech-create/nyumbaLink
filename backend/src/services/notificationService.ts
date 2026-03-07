/**
 * Notification service - Africa's Talking SMS placeholder integration
 * Set AFRICAS_TALKING_API_KEY and AFRICAS_TALKING_USERNAME in env for live SMS
 */
const API_KEY = process.env.AFRICAS_TALKING_API_KEY;
const USERNAME = process.env.AFRICAS_TALKING_USERNAME || 'sandbox';

export const sendSms = async (to: string, message: string): Promise<{ success: boolean; id?: string }> => {
  if (!to || !message) return { success: false };

  // Placeholder: in production, call Africa's Talking API
  // https://africastalking.com/docs/sms
  if (!API_KEY) {
    console.log('[SMS placeholder]', { to, message });
    return { success: true, id: `placeholder-${Date.now()}` };
  }

  try {
    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apiKey: API_KEY,
      },
      body: new URLSearchParams({
        username: USERNAME,
        to: to.replace(/\D/g, '').replace(/^0/, '254'),
        message,
      }),
    });
    const data = (await res.json()) as { SMSMessageData?: { Recipients?: { status: string; messageId?: string }[] } };
    const recipient = data.SMSMessageData?.Recipients?.[0];
    const success = recipient?.status === 'Success';
    return { success, id: recipient?.messageId };
  } catch (err) {
    console.error('Africa\'s Talking SMS error:', err);
    return { success: false };
  }
};

export const notifyListingApproval = async (ownerPhone: string, propertyTitle: string) => {
  return sendSms(ownerPhone, `NyumbaLink: Your listing "${propertyTitle}" has been approved and is now live.`);
};

export const notifyRentalApplication = async (ownerPhone: string, applicantName: string, propertyTitle: string) => {
  return sendSms(ownerPhone, `NyumbaLink: ${applicantName} applied to rent "${propertyTitle}". Log in to review.`);
};

export const notifyRentReminder = async (tenantPhone: string, amount: number, dueDate: string) => {
  return sendSms(tenantPhone, `NyumbaLink: Rent reminder. ${amount} due by ${dueDate}. Pay via the app.`);
};
