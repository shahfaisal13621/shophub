import LegalPageLayout from "../components/LegalPageLayout.jsx";

export default function Terms() {
  return (
    <LegalPageLayout title="Terms & Conditions" updatedDate="September 2026">
      <div className="legal-content">
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using ShopHub, you agree to be bound by these Terms & Conditions. If you do not
          agree, please do not use the site.
        </p>

        <h2>Use of the Site</h2>
        <p>
          You agree to use ShopHub only for lawful purposes and in a way that does not infringe the rights
          of, or restrict, anyone else's use of the site.
        </p>

        <h2>Account Registration</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all
          activity that occurs under your account.
        </p>

        <h2>Orders & Checkout</h2>
        <p>
          ShopHub's checkout is provided for demonstration purposes. No real payment information is
          collected or processed, and orders placed are not fulfilled or shipped.
        </p>

        <h2>Pricing & Availability</h2>
        <p>
          Prices and stock levels are shown as accurately as possible but may change without notice.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          The ShopHub name, logo, and site design are the property of their respective owner. Product
          images and data are sourced from third-party providers and remain their property.
        </p>

        <h2>Prohibited Conduct</h2>
        <p>
          You agree not to misuse the site, attempt unauthorized access to any account or data, or
          interfere with the site's normal operation.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          ShopHub is provided "as is" without warranties of any kind. We are not liable for any damages
          arising from your use of the site.
        </p>

        <h2>Governing Law</h2>
        <p>These terms are governed by the laws applicable in your local jurisdiction.</p>

        <h2>Changes to These Terms</h2>
        <p>We may revise these terms at any time. Continued use of the site means you accept the current version.</p>

        <h2>Contact Us</h2>
        <p>Questions about these terms can be sent to <a href="mailto:shahfaisal@gmail.com">shahfaisal@gmail.com</a>.</p>
      </div>
    </LegalPageLayout>
  );
}