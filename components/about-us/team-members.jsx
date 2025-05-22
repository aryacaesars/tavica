"use client"

import { useState } from "react"
import { Github, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"
import teamData from "@/data/team-data.json"
import { TextGenerateEffect } from "../ui/text-generate-effect"

export default function TeamMembers() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const { title, team_members } = teamData

  return (
    <div className="container mx-auto px-4 py-16 bg-white">
      <h2 className="text-4xl font-bold text-center mb-16 text-black">{title}</h2>
      <div className="flex flex-col md:flex-row gap-8 relative h-[500px]">
        {team_members.map((member, index) => {
          const isHovered = hoveredIndex === index
          const isAnyHovered = hoveredIndex !== null
          const isNotHovered = isAnyHovered && !isHovered

          return (
            <div
              key={member.id}
              className={`relative rounded-xl overflow-hidden transition-all duration-700 ease-in-out 
                ${isHovered ? "md:w-1/2 z-20" : "md:w-1/3"} 
                ${isNotHovered ? "md:w-1/4 opacity-60" : ""}
              `}
              style={{
                boxShadow: isHovered ? "0 25px 50px -12px rgba(0, 0, 0, 0.9)" : "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                transform: isHovered ? "translateY(-10px)" : "translateY(0)",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Blur overlay for non-hovered cards */}
              {isNotHovered && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-10 transition-all duration-700"></div>
              )}

              <div className="h-full flex flex-col md:flex-row relative">
                {/* Image container - always visible */}
                <div className="h-[300px] md:h-full md:w-full overflow-hidden relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className={`object-cover transition-all duration-700 ease-out ${isHovered ? "scale-105" : ""}`}
                  />

                  {/* Gradient overlay on image */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-700
                    ${isHovered ? "from-black/80 to-transparent opacity-100" : "from-black/50 to-transparent opacity-80"}`}
                  ></div>

                  {/* Basic info - visible only when NOT hovered */}
                  {!isHovered && (
                    <div className="absolute bottom-0 left-0 p-6 z-10 transition-opacity duration-300">
                      <h3 className="text-3xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-gray-300">{member.role}</p>
                    </div>
                  )}
                </div>

                {/* Expanded details - visible on hover */}
                <div
                  className={`absolute top-0 bottom-0 left-0 w-full  md:w-1/2 p-6 flex flex-col justify-center
                    transition-all duration-700 ease-in-out z-10
                    ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"}
                  `}
                  style={{
                    background: "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)",
                  }}
                >
                  <div className="max-w-full">                    {isHovered ? (
                      <>
                        <h3 className="mb-1 uppercase">
                          <TextGenerateEffect 
                            words={member.name.toUpperCase()} 
                            className="text-white text-3xl"
                          />
                        </h3>
                        <div className="mb-4">
                          <TextGenerateEffect 
                            words={member.role} 
                            className="text-gray-300 text-lg font-normal"
                          />
                        </div>
                        {/* Bio dengan animasi */}
                        <div className="mb-6">
                          <TextGenerateEffect 
                            words={member.bio} 
                            filter={false}
                            duration={1.5}
                            className="text-gray-400 font-normal line-clamp-8 text-base"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-5xl font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-gray-300 mb-4">{member.role}</p>
                        <p className="text-gray-400 mb-6 line-clamp-4">{member.bio}</p>
                      </>
                    )}

                    <div className="flex gap-5 mt-2">
                      <a
                        href={member.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
                      >
                        <Instagram className="w-6 h-6" />
                        <span className="sr-only">Instagram</span>
                      </a>
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        <Github className="w-6 h-6" />
                        <span className="sr-only">GitHub</span>
                      </a>
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                      >
                        <Linkedin className="w-6 h-6" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}