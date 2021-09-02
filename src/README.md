# Marriage Registration on Chain

This Project is build on Solana And ReactJS

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


### `yarn build:program`

Build the smart contract's Object file `.so` file which is ready to be deployed on solana blockchain

### `yarn test:program`

Test the smart contract file which is in dir `/program/src`



### Additonal Instructions

- Try to test before building the smart contract 
- Versions on which it is build on
- Currently depoyed on Solana devnet, so if connection drops try refreshing

## How it works

- This project makes use of Sollet.io as wallet so it is compatible with mobiles too.

### To register a New Certificate
- Navigate to home page and Click on `Registration` from top Navigation bar.
- Then Click `connect wallet` button on the navbar and connect your wallet. 
- After connecting your wallet it will ask for a Approval to make a storage account in which you certificate data will be stored on blockchain. Click `Approve` for that transaction
- Now try refreshing connecting wallet again and in Registration Page you can see your `Current Certificate Address`
- Now fill up your form and Details as per needed and add witnesses as much you want.
    - Please do note that each certificate has two parts:
        - Public Part : Name, Age, Gender, Date of Marriage, Place of Marriage
        - Private Part: Identification Numbers, Files attached
    - You can add many files but `2 or 3` are recommended
- Now after filling form hit Get Registered. 
    - Pro Tip: Press `Ctrl + Shift + I` to view console panel and you can watch all the processing
- After uploading files it will as for you to approve your transaction which you can do from Sollet Prompt screen
- After approving Transaction it will Prompt you to download a file. `DOWNLOAD IT` It is necessary because this file contains all the necessary keys which you will be requiring to unlock your private data.
- Try clicking Try Getting Data Button to load you newly created Certificate
- And That's all you have Successfully Registered you marriage on Solana Blockchain. 

### View a Certificate on Blockchain
- Navigate to `Home` from Navbar
- By default it will show all the Certificates which have been Registered on Solana Blockchain. If you want you can view public data on those certificates. Try Clicking on Anyone you like.

- Viewing your Certificate
    - From `Home` Page, Try Connecting your wallet. 
    - After Connecting you wallet if you have any certificate it will show you on that `Home` Page
    - If you want to view your contract on blockchain explorer Click on @__ADDRESS__ on Top of card.
        - It will navigate you to solana explorer where your data is saved on blockchain.
    - If you want to view full certificate click on Content ID `Link`
        - After clicking you will have to wait to fetch the Certificate Once Fetched you can see your Certifcate Data.
        - To view You Private Data on Blockchain use the `groom_secret` or `bride_secret` from the file which you have downloaded when registered. 
        - After Entering that try Getting Pricate data and you can see all the private data related to the Certificate.

### Upcoming Features
- More fluid UX for Users
- Adjustable Secret Sharing Scheme with custom threshold and total number of secret
- Automatic reply mails for secrets back to Groom and Bride's Email

### Additional Instructions
- If you have any issue related to project while trying, create a PR on Github @[](On Chain Marriage-Solana) 

