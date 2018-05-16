# CertProof App
The CertProof App is an integral part of the overall **CertComm** ecosystem. CertComm is used for certified communication and collaboration backed by the Blockchain. You can learn more about CertComm at https://certcomm.io. CertComm is particularly useful for communication and collaboration in high-stakes, low-trust situations.
The CertProof app is used to view and prove Certified Threads. The user must upload either a certcomm evidence file or a certcomm backup file into CertProof. The actual proof has two parts to it, viz. an *Internal Proof* and a *Blockchain Proof*. The Internal Proof is completely self-contained. It does not require a network connection in order to work. The Blockchain proof is an *additional* proof that verifies the evidence against information written by a CertComm *governor* such as https://tmail21.com to the blockchain.

When an evidence file is uploaded to CertProof, both the internal proof and the blockchain proof are executed. However, when a backup file is uploaded only the internal proof is executed. Also, the CertProof App is open source and can be used to prove Certified Thread evidence even if the Governor that produced the evidence becomes non-responsive or non-cooperative. This is a critical element of the CertComm ecosystem.

The actual proof can be used to prove certified messages, certified responses, certified update responses, certified forwards, certified templates, certified instantiation of templates, certified read acknowledgements and certified receipt acknowledgements. The proof proves all elements of the evidence including but not limited to the identities of the parties, the content of the message, the timestamp etc. 

# Screenshots
The Screenshot below shows the CertProof App with an evidence file representing a certified thread uploaded. The certified thread can be seen on the right-hand-side.

![CertProof Screenshot1 Alt text](/static_resources/Screenshot_1.png?raw=true "CertProof Screenshot 1")

In order to "prove" that the certified thread has not been tampered with in any aspect, the user needs to click "Prove". The screenshot below shows a certified thread that was proved successfully (both internally and against the Blockchain)

![CertProof Screenshot2 Alt text](/static_resources/Screenshot_2.png?raw=true "CertProof Screenshot 2") 

The screenshot below shows a proof that failed and so the user can assume that the evidence was tampered with in some way.

![CertProof Screenshot3 Alt text](/static_resources/Screenshot_3.png?raw=true "CertProof Screenshot 3")
