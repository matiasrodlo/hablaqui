# Email Sending Service

## Table of Contents

1. [Email Sending Logic](#logic)
2. [Session Reminder Emails](#session)
3. [Payment Reminder Emails](#payment)
4. [Chat Message Emails](#chat)
5. [Plan Renewal Reminder Emails](#renewal)
6. [QA Procedure](#qa)

### LOGIC

---

The logic implemented here is quite simple. It uses a structure similar to a linear data structure "queue" (not exactly, but for understanding purposes), where, through a cron job and the 'mailing.js' file (in this same folder), emails are scheduled for sending. If an email (which is stored in the database) has not been sent after its scheduled date, it is sent.

The scheduled date depends on the type of email to be sent, as each has its own sending time.

---

### SESSION

---

The session reminder email is sent 1 hour before the session starts and 1 day before the session starts. This is done so the user has time to prepare for the session, among other reasons.

---

### PAYMENT

---

The payment reminder email is sent when the user clicks the pay button and reaches the MercadoPago page to make the plan purchase, but does not complete the purchase. This email is sent to let the user know that the payment was not completed and that they can try again. The email is sent 1 hour after the user reached the MercadoPago page, and again 1 day later. After a week, the user receives a discount coupon to encourage payment, offering a 20% discount. These emails are deleted once the user completes the payment.

---

### CHAT

---

The chat message email is sent when the user receives a message in the chat that has not been read. This email is sent 15 minutes after the message arrives and remains unread, via the scheduleChatEmails endpoint found in 'cron.js'. This endpoint is important because it also creates the email that will be scheduled to be sent one day after the message remains unread.

---

### RENEWAL

---

The plan renewal reminder email is sent when the user has an expired plan and has not renewed. This email is sent three times: the first one hour after the plan expires, again one day later, and finally, like the payment reminder, a 20% discount coupon is sent to encourage renewal. These emails are deleted once the user renews the plan.

---

### QA

---

To perform QA on one or more of the emails mentioned in this README, you must first go to the cloud (GCP or AWS, depending on whether the migration has been completed). For GCP, go to https://console.cloud.google.com/cloudscheduler?project=hablaqui-staging-306619 and identify the job called "email-scheduiling". Click the three dots in the actions column and select "Force job execution". This will schedule the sending of emails that are in the MongoDB "emails" collection.

Next, go to MongoDB, find the email of interest by its subject (determined by the "type" parameter in the email document), and once found, modify the scheduled sending date (determined by the "scheduledAt" parameter). Set it to the current date/time so the email will be sent when you run the cron job again.

After modifying the date, run the same cron job again, and after a few seconds, you should receive the email you want to test.

---
