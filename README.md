# CertProof App
The CertProof App is an integral part of the overall **CertComm** ecosystem. CertComm is used for **certified communication and collaboration** backed by the Blockchain. You can learn more about CertComm at https://certcomm.io. CertComm is particularly useful for communication and collaboration in high-stakes, low-trust situations.

CertComm dramatically improves trust, truth, consistency, confusion, finger-pointing, efficiency and agility in B2B and B2C high-stakes communication and collaboration.

The CertProof app is used to view and prove Certified Threads. The user must upload either a *CertComm* evidence file or a *CertComm* backup file into the *CertProof* App. The actual proof has two parts to it, viz. an *Internal Proof* and a *Blockchain Proof*. The Internal Proof is completely self-contained. It does not require a network connection in order to work. The Blockchain proof is an *additional* proof that verifies the evidence against information written by a CertComm *governor* such as https://tmail21.com to the blockchain. Both proofs must pass for maximum assurance of non-tampering.

CertProof Evidence files come in two types, viz. Layer 1 or L1 Evidence and Layer 2 or L2 Evidence. L1 Evidence is a superset of L2 Evidence and contains additional information to prove against the Blockchain.

When an L1 evidence file is uploaded to CertProof, both the internal proof and the blockchain proof are executed. However, when a backup file or L2 Evidence file is uploaded only the internal proof is executed. Additionally, the CertProof App is open source and can be used to prove Certified Thread evidence even if the *Governor* that produced the evidence becomes non-responsive or non-cooperative. This is a critical element of the CertComm ecosystem.

The actual proof can be used to prove **Certified Messages**, **Certified Responses**, **Certified Update Responses**, **Certified Forwards**, **Certified Templates**, **Certified Instantiation of Templates**, **Certified Read Acknowledgements** and **Certified Receipt Acknowledgements**. The proof proves *all* elements of the evidence including but not limited to the identities of the parties, the content of the message, the timestamp, the type of certified operation etc. The CertProof app also enables **dynamic chain of trust**

# Screenshots

## Screenshot: View Certified Thread
The Screenshot below shows the CertProof App with an evidence file representing a certified thread uploaded. The certified thread can be seen on the right-hand-side.

![CertProof Screenshot1 Alt text](/static_resources/Screenshot_1.png?raw=true "CertProof Screenshot 1" )

## Screenshot: Successful Proof
In order to "prove" that the certified thread has not been tampered with in any aspect, the user needs to click "Prove". The screenshot below shows a certified thread that was proved successfully (both internally and against the Blockchain)

![CertProof Screenshot2 Alt text](/static_resources/Screenshot_2.png?raw=true "CertProof Screenshot 2") 

## Screenshot: Proof Failed
The screenshot below shows a proof that failed and so the user can assume that the evidence was tampered with in some way.

![CertProof Screenshot3 Alt text](/static_resources/Screenshot_3.png?raw=true "CertProof Screenshot 3")

# The Evidence for a Certified Operation
The Evidence for a Certified Operation is the input to the CertProof app and is required in order to prove that a certified thread made up of one or more certified operations has not been tampered with. The Evidence consists of three parts, one of which is confidential and two of which are public. The end user (*transacting party*) only deals directly with the confidential evidence file (CCEF).

## CertComm Confidential Evidence File (CCEF)
The first piece of evidence is the CertComm Confidential Evidence File. As the name suggests, this part of the evidence is **confidential** and is only distributed by the Governor to the parties to the thread. The end user (*transacting party*) needs to upload this file to CertProof in order to perform the proof. The file is a ZIP file in the CCEF format.

The Screenshot below shows a user downloading a CCEF File for a particular changeset in a particuar thread from the Governor that manages that thread.

![CertProof Screenshot4 Alt text](/static_resources/Screenshot_4.png?raw=true "CertProof Screenshot 4")

The CCEF File can be in L1 or L2 format. L1 is a superset of the L2 format and contains additional information to prove against the blockchain.

## CertComm Public Evidence File (CPEF)
The CertComm governor also writes out Public Evidence Files to *IPFS*. The end user (*transacting party*) does not directly deal with CPEF. The CPEF is used by network entities such as Auditors.

## CertComm Blockchain Anchor
A key element of CertComm (and the CertProof App) is that they produce and require evidence in the form of "anchors" to be written to the Blockchain. These anchors are governed by Smart Contracts. An Adaptor pattern is used to support multiple Blockchains. Currently the **Ethereum** Blockchain is supported, but other Blockchains will be supported in the future as well. The anchor is **public** information. The end user (*transacting party*) does not need to deal directly with this part of the evidence.

# How to Get the CertProof App
There are two ways to get the CertProof App. You can directly download the binary installers (available for Windows and Mac) or you can build an installer from this Github source. The former is more convenient. The latter is recommended for maximimum security. Note that the CertProof App is a Javascript app built using *Electron*, *ReactJS* and *MobX*.

## Download the Installer
The most convenient way 

### Download a Windows Installer
The official windows installer can be found at [Official Installers](https://github.com/certcomm/CertProof/releases). 
Once there look for the newest Installer (at the top of the page), that starts with **certproof-win-latest-...**.
Once downloaded, click (or double click) on the installer in order to install it.

### Download a Mac Installer
The official Mac installer can be found at [Official Installers](https://github.com/certcomm/CertProof/releases). 
Once there look for the newest Installer (at the top of the page(, that starts with **certproof-osx-latest-...**.

### Download a Linux Installer
The official Linux installer can be found at [Official Installers](https://github.com/certcomm/CertProof/releases). 
Once there look for the newest Installer (at the top of the page(, that starts with **certproof-linux-latest-....**.



## Build an Installer from Source
For the most paranoid/security conscious, they can choose to build the installer from source. This is less conveninent, but the user can be sure that they are dealing with the latest version of the (authoratative code).

To build from source, execute the following steps

1. Install node/npm from - https://nodejs.org/en/download/
1. Download or clone code from - https://github.com/certcomm/CertProof
   1. To download code: Download the latest code from the link https://github.com/certcomm/CertProof/archive/master.zip and unzip it to a directory
   1. To clone code: follow below steps (URL - ):
      1. Install git - https://www.linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/
      1. Open Git Bash.
      1. Change the current working directory to the location where you want the cloned directory to be made.
      1. Type command to clone - git clone https://github.com/certcomm/CertProof.git
1. Open terminal or command prompt and go to root folder of cloned or unzipped directory and run command - npm install
1. Then run command - npm run dist
1. You will get the generated installer (.AppImage or .exe or .dmg, depending on your OS) under dist folder.

# Other Uses
## Using the CertProof App to aid in building a *CertComm Governor*
Another use of the CertProof App is to aid a developer in the building of a *CertComm Governor*. CertComm Governors are parties which mediate the creation and updating of Certified Threads. Every Certified thread operation results in three kinds of output, viz. a **CertComm Confidential Evidence File**, **CertComm Public Evidence File** and **CertComm Blockchain Anchor**. The CertProof App can be used by a developer who is building a CertComm Governor to verify that their Governor is producing these outputs correctly.

## Using the CertProof App as an offline Viewer
The CertProof app can be used as an offline viewer for certified (and non-certified) threads. This ensures that all content will be viewable independent of the rest of the CertComm ecosystem. The same strategy can be used for backups.
