import LegalPageLayout from "../components/LegalPageLayout.jsx";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" updatedDate="September 2026">
      <div className="legal-content">
        <h2>Introduction</h2>
        <p>
          This Privacy Policy explains how ShopHub collects, uses, and protects information when you use
          this site. By creating an account or placing an order, you agree to the practices described below.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li><strong>Account information</strong> — your name and email address when you sign up.</li>
          <li><strong>Order information</strong> — delivery details (name, phone, address, city) and the items in each order you place.</li>
          <li><strong>Local browsing data</strong> — your cart and wishlist are stored in your browser so they persist between visits.</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>
          We use the information above to create and manage your account, process and display your orders,
          and keep your cart and wishlist available across sessions. We do not sell or share your personal
          information with third parties for marketing purposes.
        </p>

        <h2>Cookies & Local Storage</h2>
        <p>
          ShopHub uses your browser's local storage to remember your cart and wishlist. This data stays on
          your device and is not shared with other users.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          Account authentication and order storage are handled by Firebase (Google). Product catalog data
          is sourced from the public DummyJSON API. These services process data on our behalf and maintain
          their own security practices.
        </p>

        <h2>Data Security</h2>
        <p>
          Order records are private to your account — only you (and store administrators, for fulfillment
          purposes) can view your order history. Access to order data is enforced through database security
          rules.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request that your account and associated order history be removed by contacting us using
          the details below.
        </p>

        <h2>Children's Privacy</h2>
        <p>ShopHub is not directed at children under 13, and we do not knowingly collect information from them.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this policy from time to time. Continued use of the site after changes means you accept the revised policy.</p>

        <h2>Contact Us</h2>
        <p>Questions about this policy can be sent to <a href="mailto:shahfaisal@gmail.com">shahfaisal@gmail.com</a>.</p>
      </div>
    </LegalPageLayout>
  );
}