# Setting Up Your Project Locally with VS Code

Follow these steps to download your project from the web editor and run it on your local machine using Visual Studio Code.

## 1. Prerequisites

Before you begin, ensure you have the following software installed on your computer:

- **Node.js**: This project requires Node.js. It comes bundled with `npm` (Node Package Manager), which you'll need to install project dependencies. You can download it from [nodejs.org](https://nodejs.org/). We recommend the latest LTS (Long-Term Support) version.
- **Visual Studio Code**: The code editor we'll be using. You can download it from [code.visualstudio.com](https://code.visualstudio.com/).

## 2. Download Your Project

In the web-based IDE you are currently using, find the option to download or export the project files. This will typically download a `.zip` archive of your entire codebase. Once downloaded, unzip the file to a location of your choice on your computer.

## 3. Open in VS Code

1.  Launch Visual Studio Code.
2.  Go to `File > Open Folder...` (or `File > Open...` on macOS).
3.  Navigate to the folder where you unzipped your project and open it.
4.  Open the integrated terminal in VS Code by going to `View > Terminal` or by using the shortcut ``ctrl+` ``.

## 4. Install Dependencies

With the terminal open in your project's root directory, run the following command. This will read the `package.json` file and install all the necessary libraries and packages for the application to run.

```bash
npm install
```

This might take a few minutes to complete.

## 5. Configure Environment Variables

Your application relies on several external services (Firebase, Appwrite, Razorpay) and requires API keys and configuration details to connect to them. You must store these securely in a local environment file.

1.  In the root directory of your project, create a new file named `.env.local`.

2.  Copy the following content into your new `.env.local` file:

    ```env
    # Firebase Configuration (already in src/lib/firebase.ts, no action needed unless you change it)

    # Razorpay API Keys (from your Razorpay dashboard)
    RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
    RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
    NEXT_PUBLIC_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID

    # Appwrite Configuration (from your Appwrite project settings)
    APPWRITE_ENDPOINT=YOUR_APPWRITE_ENDPOINT
    APPWRITE_PROJECT_ID=YOUR_APPWRITE_PROJECT_ID
    APPWRITE_API_KEY=YOUR_APPWRITE_API_KEY
    APPWRITE_DATABASE_ID=YOUR_APPWRITE_DATABASE_ID
    APPWRITE_COLLECTION_ID=YOUR_APPWRITE_COLLECTION_ID

    # Genkit/Google AI
    # Create an API key from Google AI Studio: https://aistudio.google.com/app/apikey
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

3.  **Replace all placeholder values** (`YOUR_...`) with your actual credentials from each service's dashboard.

## 6. Run the Application

You're all set! To start the application, run the following command in the VS Code terminal:

```bash
npm run dev
```

This will start the Next.js development server, typically on `http://localhost:9002`. You can now open this URL in your web browser to see your application running live!

Any changes you make to the code in VS Code will now automatically reload in the browser.
