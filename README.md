# CertProof App
The CertProof App is an integral part of the overall **CertComm** ecosystem. CertComm is used for **certified communication and collaboration** backed by the Blockchain. You can learn more about CertComm at https://certcomm.io. CertComm is particularly useful for communication and collaboration in high-stakes, low-trust situations.

The CertProof app is used to view and prove Certified Threads. The user must upload either a *CertComm* evidence file or a *CertComm* backup file into the *CertProof* App. The actual proof has two parts to it, viz. an *Internal Proof* and a *Blockchain Proof*. The Internal Proof is completely self-contained. It does not require a network connection in order to work. The Blockchain proof is an *additional* proof that verifies the evidence against information written by a CertComm *governor* such as https://tmail21.com to the blockchain. Both proofs must pass for maximum assurance of non-tampering.

When an evidence file is uploaded to CertProof, both the internal proof and the blockchain proof are executed. However, when a backup file is uploaded only the internal proof is executed. Also, the CertProof App is open source and can be used to prove Certified Thread evidence even if the *Governor* that produced the evidence becomes non-responsive or non-cooperative. This is a critical element of the CertComm ecosystem.

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
The Evidence for a Certified Operation is the input to the CertProof app and is required in order to prove that a certified thread made up of one or more certified operations has not been tampered with. The Evidence consists of three parts, one of which is confidential and two of which are public. The end user (*transacting party*) only deals directly with the confidential evidence file.

## CertComm Confidential Evidence File (CCEF)
The first piece of evidence is the CertComm Confidential Evidence File. As the name suggests, this part of the evidence is **confidential** and is only distributed by the Governor to the parties to the thread. The end user (*transacting party*) needs to upload this file to CertProof in order to perform the proof. The file is a ZIP file in the CCEF format.

## CertComm Layer 2 Evidence File (CL2EF) 
CertComm Layer 2 Evidence Files (CL2EF) consist of File(s) corresponding to the Certified operation written to **IPFS**. This is **public** information. The File(s) represent the Layer 2 "blockchain" evidence for the Layer 2 Blockchain maintained by a Governor. These Files are written by the governor to IPFS. The end user (*transacting party*) does *not* need to directly deal with these files. These files are in JSON format and adhere to the CL2EF format.

## CertComm Blockchain Anchor
A key element of CertComm (and the CertProof App) is that they produce and require evidence in the form of "anchors" to be written to the Blockchain. These anchors are governed by Smart Contracts. An Adaptor pattern is used to support multiple Blockchains. Currently the **Ethereum** Blockchain is supported, but other Blockchains will be supported in the future as well. The anchor is **public** information. The end user (*transacting party*) does not need to deal directly with this part of the evidence.

# How to Get the CertProof App
There are two ways to get the CertProof App. You can directly download the binary installers (available for Windows and Mac) or you can build an installer from this Github source. The former is more convenient. The latter is recommended for maximimum security. Note that the CertProof App is an *Electron* based app.

## Download the Installer

### Download a Windows Installer

### Download a Mac Installer

## Build an Installer from Source

### Build a Windows Installer from Source

### Build a Mac Installer from Source

# Other Uses
## Using the CertProof App to aid in building a *CertComm Governor*
Another use of the CertProof App is to aid a developer in the building of a *CertComm Governor*. CertComm Governors are parties which mediate the creation and updating of Certified Threads. Every Certified thread operation results in three kinds of output, viz. a **CertComm Confidential Evidence File**, **CertComm Layer 2 Evidence File** and **CertComm Blockchain Anchor**. The CertProof App can be used by a developer who is building a CertComm Governor to verify that their Governor is producing these outputs correctly.

## Using the CertProof App as an offline Viewer
The CertProof app can be used as an offline viewer for certified (and non-certified) threads. This ensures that all content will be viewable independent of the rest of the CertComm ecosystem.
