/**
 * One-shot backfill after introducing newsletter Double-Opt-In.
 *
 * All subscribers that existed before DOI was introduced are treated as
 * already confirmed — they explicitly opted in via the old form, so we
 * must not reset them to unconfirmed/unsubscribed and prompt them again.
 *
 * Run once with: npx tsx scripts/backfill-newsletter-doi.ts
 */
import { prisma } from '../src/lib/prisma'

async function main() {
  const result = await prisma.newsletterSubscriber.updateMany({
    where: {
      confirmed: false,
      confirmToken: null,
    },
    data: {
      confirmed: true,
      subscribed: true,
    },
  })
  console.log(`backfilled ${result.count} pre-DOI subscribers as confirmed=true / subscribed=true`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
