'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import cheif1 from '@/public/dignitaries/images-2.jpeg.jpg'
import cheif2 from '@/public/dignitaries/Aisshwarya DKS Hegde (1).jpg'
import cheif3 from '@/public/dignitaries/Vice chancellor  S. Vidyashankar VTU.jpg'
import patron1 from '@/public/dignitaries/FinanceOfficer Prashanth Nayaka VTU.jpg'
import patron2 from '@/public/dignitaries/Physical Education Director Kadagada kai VTU.png'
import patron3 from '@/public/dignitaries/Registrar Dr. B. E. Rangaswamy VTU.jpg'
import patron4 from '@/public/dignitaries/Registrar Shrinivas VTU.png'
import organize1 from '@/public/dignitaries/hbp.png'
import organize2 from '@/public/dignitaries/snr.jpeg'

const Dignitaries = () => {
    const committee = {
        chiefPatron: {
            title: "Chief Patron",
            members: [
                {
                    name: "SRI D K SHIVAKUMAR",
                    role: "CHAIRMAN, NEF",
                    image: cheif1
                },
                {
                    name: "MS AISSHWARYA DKS HEGDE",
                    role: "TRUSTEE SECRETARY, NEF",
                    image: cheif2
                },
                {
                    name: "DR. VIDYASHANKAR S",
                    role: "VICE CHANCELLOR VTU, BELAGAVI",
                    image: cheif3
                }
            ]
        },
        patrons: {
            title: "Patrons",
            members: [
                {
                    name: "DR NAGAMANI NAGARAJA",
                    role: "CHIEF OF STRATEGY AND SYSTEMS,GAT",
                    image: ""
                },
                {
                    name: "DR B E RANGASWAMY",
                    role: "REGISTRAR VTU, BELAGAVI",
                    image: patron3
                },
                {
                    name: "DR PRASHANTHA NAYAKA G",
                    role: "FINANCE OFFICER VTU, BELAGAVI",
                    image: patron1
                },
                {
                    name: "DR T N SREENIVAS",
                    role: "REGISTRAR(EVALUATION) VTU, BELAGAVI",
                    image: patron4
                },
                {
                    name: "DR P V KADAGADAKAI ",
                    role: "DIRECTOR OF PHYSICAL EDUCATION I/C VTU, BELAGAVI",
                    image: patron2
                },
            ]
        },
        organizingChairs: {
            title: "ORGANIZING CHAIRS",
            members: [
                {
                    name: "DR H B BALAKRISHNA",
                    role: "PRINCIPAL , GAT",
                    image: organize1
                },
                {
                    name: "DR SRIDHAR",
                    role: "CAMPUS DIRECTOR , GAT",
                    image: ""
                },
                {
                    name: "LT.SARAVANAN R",
                    role: "PHYSICAL EDUCATION DIRECTOR, GAT",
                    image: organize2
                }
            ]
        },
        advisory: {
            title: "Advisory",
            members: [
                {
                    name: "DR SIVARAM REDDY",
                    role: "VTU SPORTS COMMITTE MEMBER, VTU",
                    image: ""
                },
                {
                    name: "DR RAJESH Y H",
                    role: "FORMER PED DIRECTOR, VTU",
                    image: ""
                },
                {
                    name: "DR KIRAN KUMAR H R",
                    role: "PED DIRECTOR, MSRIT",
                    image: ""
                },
                {
                    name: "MR UMESH",
                    role: "REGIONAL DIRECTOR (BANGALORE SOUTH DIVISION), VTU",
                    image: ""
                },
                {
                    name: "DR G R GURUNAGENDRA",
                    role: "MECH DEPT, GAT",
                    image: ""
                },
                {
                    name: "DR KUMARSWAMY S",
                    role: "CSE DEPT, GAT",
                    image: ""
                },
                {
                    name: "DR LEELAVATHI HP",
                    role: "ECE DEPT, GAT",
                    image: ""
                },
                {
                    name: "DR G JAYACHITRA",
                    role: "EEE DEPT, GAT",
                    image: ""
                },
                {
                    name: "MR MUNIKRISHNA M",
                    role: "ADMIN OFFICE, GAT",
                    image: ""
                }
            ]
        }
    }

    return (
        <div>
            <div className="flex flex-col min-h-screen pt-20 pb-12 lg:pt-[120px] bg-gradient-to-br from-background to-secondary">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-16">Committee Members</h1>

                    {Object.entries(committee).map(([key, section]) => (
                        <div key={key} className="mb-16">
                            <h2 className="text-2xl font-semibold mb-8 text-center">
                                {section.title}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {section.members.map((member, index) => (
                                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <CardHeader className="p-0">
                                            <div className="relative h-48 bg-gray-200">
                                                <Image
                                                    src={member.image || "/placeholder.svg?height=192&width=384"}
                                                    alt={`Photo of ${member.name}`}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <h3 className="font-semibold text-lg mb-2">{member.name}</h3>
                                            <p className="text-sm text-muted-foreground">{member.role}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dignitaries

