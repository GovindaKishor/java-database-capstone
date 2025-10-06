# User Stories

## Admin User Stories

### 1. Log into the portal

**Title:**
*As an admin, I want to log into the portal with my username and password, so that I can manage the platform securely.*

**Acceptance Criteria:**

1. Admin can enter valid credentials and access the portal.
2. Invalid credentials should show an error message.
3. Login session should be secure with role-based access.

**Priority:** High
**Story Points:** 3
**Notes:** Consider adding captcha or MFA for extra security.

---

### 2. Log out of the portal

**Title:**
*As an admin, I want to log out of the portal, so that I can protect system access from unauthorized users.*

**Acceptance Criteria:**

1. Admin can log out with a single click.
2. Session should terminate immediately.
3. Redirect to the login screen after logout.

**Priority:** High
**Story Points:** 2

---

### 3. Add doctors

**Title:**
*As an admin, I want to add doctors to the portal, so that patients can book appointments with them.*

**Acceptance Criteria:**

1. Admin can enter doctor details (name, specialization, contact info).
2. New doctor profiles are saved in the system.
3. Confirmation message is shown upon successful addition.

**Priority:** High
**Story Points:** 5

---

### 4. Delete doctor profiles

**Title:**
*As an admin, I want to delete a doctor’s profile, so that the portal only shows active doctors.*

**Acceptance Criteria:**

1. Admin can search and select a doctor profile for deletion.
2. Deleted profiles should no longer be visible to patients.
3. Deletion should be logged for auditing.

**Priority:** High
**Story Points:** 5

---

### 5. Run stored procedure for statistics

**Title:**
*As an admin, I want to run a stored procedure in MySQL CLI to get the number of appointments per month, so that I can track usage statistics.*

**Acceptance Criteria:**

1. Stored procedure executes successfully and returns monthly appointment counts.
2. Admin can export or view the results in the portal.
3. Errors should be logged and displayed properly.

**Priority:** Medium
**Story Points:** 8
**Notes:** Consider integrating automated reports instead of CLI.

---

## Patient User Stories

### 1. View doctors without login

**Title:**
*As a patient, I want to view a list of doctors without logging in, so that I can explore options before registering.*

**Acceptance Criteria:**

1. Doctor list is publicly accessible.
2. List shows name, specialization, and location.
3. No patient details or sensitive info is visible.

**Priority:** High
**Story Points:** 3

---

### 2. Sign up

**Title:**
*As a patient, I want to sign up using my email and password, so that I can book appointments.*

**Acceptance Criteria:**

1. Registration form accepts email, password, and basic details.
2. Password must meet security requirements.
3. Success message and login option appear after sign-up.

**Priority:** High
**Story Points:** 5

---

### 3. Log in

**Title:**
*As a patient, I want to log into the portal, so that I can manage my bookings.*

**Acceptance Criteria:**

1. Login requires valid email and password.
2. Invalid login shows error.
3. Successful login redirects to patient dashboard.

**Priority:** High
**Story Points:** 3

---

### 4. Log out

**Title:**
*As a patient, I want to log out of the portal, so that I can secure my account.*

**Acceptance Criteria:**

1. Logout button available in dashboard.
2. Session ends immediately upon logout.
3. Redirect to login screen after logout.

**Priority:** High
**Story Points:** 2

---

### 5. Book appointments

**Title:**
*As a patient, I want to book an hour-long appointment, so that I can consult with a doctor.*

**Acceptance Criteria:**

1. Patient can select a doctor and available time slot.
2. Appointment duration is set to one hour.
3. Confirmation email/notification is sent.

**Priority:** High
**Story Points:** 8

---

### 6. View upcoming appointments

**Title:**
*As a patient, I want to view my upcoming appointments, so that I can prepare accordingly.*

**Acceptance Criteria:**

1. Dashboard lists all upcoming appointments with date/time.
2. Patient can see doctor details for each appointment.
3. Cancel/reschedule option available if allowed.

**Priority:** Medium
**Story Points:** 5

---

## Doctor User Stories

### 1. Log into the portal

**Title:**
*As a doctor, I want to log into the portal, so that I can manage my appointments.*

**Acceptance Criteria:**

1. Doctor enters credentials to log in.
2. Invalid login should show error.
3. Successful login redirects to doctor dashboard.

**Priority:** High
**Story Points:** 3

---

### 2. Log out of the portal

**Title:**
*As a doctor, I want to log out of the portal, so that I can protect my data.*

**Acceptance Criteria:**

1. Logout option is visible.
2. Session ends immediately.
3. Redirected to login page.

**Priority:** High
**Story Points:** 2

---

### 3. View appointment calendar

**Title:**
*As a doctor, I want to view my appointment calendar, so that I can stay organized.*

**Acceptance Criteria:**

1. Calendar displays upcoming appointments by date/time.
2. Ability to filter by day/week/month.
3. Sync with external calendar (optional).

**Priority:** High
**Story Points:** 8

---

### 4. Mark unavailability

**Title:**
*As a doctor, I want to mark my unavailability, so that patients can only book available slots.*

**Acceptance Criteria:**

1. Doctor can select unavailable dates/times.
2. Blocked slots are hidden from patient booking view.
3. Changes are saved instantly.

**Priority:** High
**Story Points:** 8

---

### 5. Update profile

**Title:**
*As a doctor, I want to update my profile with specialization and contact information, so that patients have up-to-date information.*

**Acceptance Criteria:**

1. Doctor can edit profile details (specialization, phone, email).
2. Changes reflect immediately in patient view.
3. Profile updates are stored securely.

**Priority:** Medium
**Story Points:** 5

---

### 6. View patient details

**Title:**
*As a doctor, I want to view patient details for upcoming appointments, so that I can be prepared.*

**Acceptance Criteria:**

1. Doctor can see patient name, appointment reason, and contact info.
2. Details are only visible for confirmed appointments.
3. Data is secured with role-based access.

**Priority:** High
**Story Points:** 8
