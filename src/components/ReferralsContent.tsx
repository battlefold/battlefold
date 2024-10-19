"use client"

import React, { useEffect, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Users, Copy, Check, Share2, Percent } from 'lucide-react'
import { getInviteCode, getInvitedUsers, getUserInfo, getSettings } from '@/utils/api'
import AnimatedCounter from './AnimatedCounter'


interface ReferralsContentProps { }
const ReferralsContent: React.FC<ReferralsContentProps> = () => {

  const [copied, setCopied] = useState(false)
  const [inviteCode, setInviteCode] = useState(null)
  const [invitedUsers, setInvitedUsers] = useState([] as any[])
  const [inviterPoints, setInviterPoints] = useState(100)
  const [inviterPercentage, setInviterPercentage] = useState(1)
  const [isLoading, setIsLoading] = useState(true);

  // The URL and text to share via the Telegram deep link
  const urlToShare = process.env.NEXT_PUBLIC_TG_APP_URL + '?startapp=' + inviteCode;
  const shareMessage = "Hey, Join BattleFold!"; // Replace with your message

  // Create the Telegram deep link
  const telegramDeepLink = `https://t.me/share/url?url=${encodeURIComponent(urlToShare)}&text=${encodeURIComponent(shareMessage)}`;


  // const copyToClipboard = (inviteCodeParam: string) => {
  //   const inviteUrl = process.env.NEXT_PUBLIC_TG_APP_URL + '?startapp=' + inviteCodeParam;
  //   console.log(inviteUrl)
  //   if (typeof window !== "undefined" && window.navigator) {
  //     window.navigator.clipboard.writeText(inviteUrl).then(() => {
  //       setCopied(true)

  //       setTimeout(() => setCopied(false), 1000)
  //       // window.location = telegramDeepLink
  //     })
  //   }
  //   return;
  // }

  useEffect(() => {
    if (!inviteCode) {
      getInviteCodeCall();
      getInvitedUsersCall();
    }
  }, []);

  const getInviteCodeCall = async () => {
    let user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user as string);
    if (parsedUser.invitecode) {
      setInviteCode(parsedUser.invitecode);
      return;
    }
    try {
      const inviteCodeLocal = await getInviteCode();
      setInviteCode(inviteCodeLocal);
      await getUserInfo(null);
    } catch (error) {
      console.error('Failed to get invite code:', error);
    }
  }

  const getInvitedUsersCall = async () => {
    try {
      const invitedUsers = await getInvitedUsers();
      setInvitedUsers(invitedUsers);
    } catch (error) {
      console.error('Failed to get invited users:', error);
    }
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await getSettings();
        setInviterPoints(settings.user.inviterPoints);
        setInviterPercentage(settings.user.inviterPercentage);
      } catch (error) {
        console.error('Failed to fetch referral settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pb-28 px-4 pt-8">
      <div className="w-full max-w-[368px]">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Play with Frens</h1>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg shadow-md mb-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Share2 className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Invite Friends</h2>
            </div>
            <div className="bg-white bg-opacity-20 rounded-md px-2 py-1">
              <span className="font-mono text-sm">{inviteCode ? inviteCode : '...'}</span>
            </div>
          </div>
          <p className="text-sm mb-3 opacity-90">
            Share your code and earn rewards!
          </p>

          <a
            href={telegramDeepLink} target="_blank" rel="noopener noreferrer">
            <Button
              className="w-full bg-white text-blue-600 hover:bg-blue-100 transition-colors duration-200 text-sm"
            >Share to Telegram</Button>
          </a>


        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Referral Rewards</h2>
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-sm text-gray-600">
              Earn <span className="font-bold">
                {isLoading ? <AnimatedCounter end={100} duration={2000} /> : inviterPoints}
              </span> points for each friend who joins
            </p>
          </div>
          <div className="flex items-center">
            <Percent className="w-5 h-5 text-blue-500 mr-2" />
            <p className="text-sm text-gray-600">
              Earn <span className="font-bold">
                {isLoading ? <AnimatedCounter end={5} duration={2000} /> : inviterPercentage}
              </span>% of total points your friends earn
            </p>
          </div>
        </div>
        {invitedUsers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Friends</h2>
            <ScrollArea className="h-[calc(100vh-500px)]">
              <div className="flex flex-col space-y-2">
                {invitedUsers.map((user) => (
                  <ReferralItem
                    key={user.id}
                    name={user.username ? user.username : ""}
                    points={user.highestPoints ? user.highestPoints : 0}
                    image={user.image ? user.image : ""}
                    earnedPoints={0}
                  />
                ))}

              </div>
            </ScrollArea>
          </div>
        )}

      </div>
    </div>
  )
}

function ReferralItem({ name, points, earnedPoints, image }: { name: string; points: number; earnedPoints: number, image: string }) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <img src={image ? image : `https://api.dicebear.com/6.x/bottts/svg?seed=${name}`} alt={name} className="w-10 h-10 rounded-full" />
        </div>
        <div>
          <p className="font-medium text-gray-800 text-sm">{name}</p>
          <p className="text-xs text-gray-500">{points} pts</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-green-600 text-sm">+{(points * 1 / 100).toFixed(1)}</p>
      </div>
    </div>
  )
}

export default ReferralsContent;
