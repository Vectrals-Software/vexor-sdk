<div align="center">
  <a href="https://vexorpay.com">
    <img src="https://docs.vexorpay.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.8ef20009.png&w=1920&q=75" alt="Vexor logo" height="128">
  </a>
  <h1>Vexor</h1>
  <p>Simplify multi-gateway payments for developers</p>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/vexor"><img src="https://img.shields.io/npm/v/vexor.svg?style=for-the-badge&labelColor=000000" alt="NPM version"></a>
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge&labelColor=000000" alt="License">
  <a href="https://discord.gg/ZpMDsfBkgY"><img src="https://img.shields.io/badge/Join%20our%20Discord-blueviolet.svg?style=for-the-badge&logo=Discord&labelColor=000000&logoWidth=20" alt="Join our Discord"></a>
</div>



## Getting Started

Vexor is a powerful payment integration platform designed to simplify multi-gateway payments for developers. With straightforward configuration, it allows you to effortlessly connect to multiple payment providers, including Stripe, PayPal, and MercadoPago, without the need for complex coding or handling different SDKs.

To get started with Vexor:

1. Install the Vexor SDK:
   ```bash
   npm install vexor
   ```

2. Initialize Vexor in your project:
   ```javascript
   import { Vexor } from "vexor";

   const vexor = Vexor.init({
    platforms: {
        // Read the docs for more information on how to configure the platforms
    }
   });
   
   // Or using Vexor Cloud 
   const vexor = Vexor.fromEnv();


   ```


3. Start using Vexor's features in your application.

For detailed guides and SDK reference, visit our [documentation](https://docs.vexorpay.com).

## Key Features

- **Unified SDK**: Connect to multiple payment gateways with a single SDK.
- **Easy Setup**: Streamlined process for quick deployment and configuration.
- **Security First**: End-to-end encryption for API keys and secrets.
- **Autoscaling**: Handles from small to millions of transactions efficiently.
- **Multi-Framework Support**: Compatible with various backend and frontend technologies.

## Documentation

For full documentation, visit [https://docs.vexorpay.com](https://docs.vexorpay.com).

## Community

Join our [Discord community](https://discord.gg/ZpMDsfBkgY) to get help, share ideas, and connect with other developers.

## License

Vexor is open source software licensed under the MIT License.
