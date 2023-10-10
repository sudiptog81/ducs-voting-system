import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function insertVote(email, president, vice_president, treasurer, secretary, joint_secretary) {
  const vote = await prisma.vote.create({
     data: {email, president, vice_president, treasurer, secretary, joint_secretary}
  })
  console.log(vote);
}

export async function checkVoted(profile) {
  try {
    await prisma.vote.findFirstOrThrow(profile.email)
    return true;
  } catch (e) {
    return false;
  }
}
