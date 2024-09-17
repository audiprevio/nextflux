
![A4 - 1](https://github.com/user-attachments/assets/09f96a34-9d37-46cf-be1e-52d5d47f97c3)



**NextFlux: Image Generation with FAL.AI**
==========================================

NextFlux is a plug-and-play Next.js image generation app utilizing Flux.1 Dev through the FAL.AI API. This project allows users to generate images based on user-provided prompts and offers a multi-turn image generation feature using the Recall functionality.

This is the first version of NextFlux, I made the project as simple as possible to allow quick plug and play. More improvements coming in future iterations!

**Table of Contents**
---------------------

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [API Routes](#api-routes)
-   [Contributing](#contributing)
-   [License](#license)

**Features**
------------

-   Multi-turn image generation via the **Recall** feature, which enables the inclusion of previous prompts (now 1-5 prompts, but you can add more) for contextual image generation.
-   Chat history stored locally in the browser using **localStorage**, allowing users to revisit or delete past chats.
-   Easy-to-swap model configuration for image generation models available on **FAL.AI**.
-   **Re-fire** feature to regenerate images based on previously submitted prompts without needing to rewrite them.
-   **Delete** feature to remove the prompt input from your Local Storage
-   User-friendly interface to submit prompts, regenerate images, and manage chat history.

**Tech Stack**
--------------

-   **Next.js**: For server-side rendering and API routes.
-   **FAL.AI**: For image generation.
-   **Tailwind CSS**: For styling the UI.
-   **Shadcn/ui**: Component library.
-   **React**: To handle the front-end functionality.

**FAL API KEY**
------------
NextFlux generates images using Flux.1 Dev through FAL.AI. So you need to get your API key first.

**Installation**
----------------

1.  Clone the repository:

    `git clone https://github.com/audiprevio/nextflux.git`

    `cd nextflux`

3.  Install dependencies:

    `npm install`

4.  Set up your FAL.AI API KEY environment variables in `.env.local`:

    `FAL_KEY=your_api_key_here`

5.  Run the development server:

    `npm run dev`

    Your app will be running at `http://localhost:3000`.

**Usage**
---------

1.  Enter a prompt in the input field to generate an image using FAL.AI.
2.  Use the Recall feature to include past prompts for more context-aware generations.
3.  Use the Re-fire feature to regenerate images based on previously submitted prompts.
4.  Use the Delete feature to delete prompt input and the corresponding image.
5.  Images generated will be displayed below the input field with an option to regenerate or delete chats.

**Project Structure**
---------------------

Here's a breakdown of the key files and directories in this project:
```
src/
├── app/
│   ├── api/
│   │   └── v1/gen-img-flux/
│   │       └── route.js       # API route for image generation
│   ├── fonts/                 # Custom fonts
│   ├── globals.css            # Global CSS
│   ├── layout.js              # Layout file for consistent structure
│   ├── page.js                # Main UI for prompt input and image display
│   └── components/
│       └── ui/
│           ├── select.jsx     # UI component for selecting recall prompts
│           ├── separator.jsx  # Separator component
│           ├── slider.jsx     # Slider component (if used)
│           └── tooltip.jsx    # Tooltip component for explaining features
├── lib/                       # Utility functions (if applicable)
├── .env.local                 # Environment variables
├── .eslintrc.json             # Linter configuration
├── .gitignore                 # Files to ignore in the repository
├── next.config.js             # Next.js configuration
└── package.json               # Project metadata and dependencies
```

### **Key Files**

-   **`app/api/v1/gen-img-flux/route.js`**: Handles the POST request to generate images using FAL.AI based on user input and Recall.
-   **`app/page.js`**: The main UI component that includes the input field for prompts, Recall options, and displays the chat history.
-   **`components/ui/`**: Contains reusable UI components such as `Select`, `Tooltip`, and `Separator`.

**API Routes**
--------------

### **POST /api/v1/gen-img-flux**

**Description**: Generates an image using the FAL.AI API based on the user's prompt and Recall history.

-   **Request**:

    -   Method: POST
    -   Headers:
        -   Content-Type: `application/json`
    -   Body:

        `{
          "prompt": "A detailed description",
          "context": "Optional context from previous prompts"
        }`

-   **Response**:

    -   Success: Returns the generated image URL.

        `{
          "result": {
            "images": [
              {
                "url": "https://generated-image-url.com"
              }
            ]
          }
        }`

    -   Error: Returns an error message if the image generation fails.

* * * * *

**Contributing**
----------------

Feel free to contribute by submitting issues or pull requests. For major changes, please open an issue first to discuss what you'd like to change.

**License**
-----------

This project is licensed under the MIT License.

* * * * *
