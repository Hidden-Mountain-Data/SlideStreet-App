import { Dates, PrismaClient } from '@prisma/client';
import {
  addYears,
  eachDayOfInterval,
  format,
  getDate,
  getDay,
  getDayOfYear,
  getMonth,
  getQuarter,
  getWeek,
  getYear,
} from 'date-fns';

const prisma = new PrismaClient();

export async function seedDates(): Promise<void> {
  const existingRecords = await prisma.dates.findFirst();
  if (existingRecords) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'Dates already exist, skipping seed function.',
    );
    return;
  }

  const dateRecords = getDates();

  await prisma.dates
    .createMany({
      data: dateRecords,
      skipDuplicates: true,
    })
    .then(() => {
      console.log(
        '\x1b[36m%s\x1b[0m',
        'Dates created successfully, here is what the first looks like: ',
        dateRecords[0],
      );
    })
    .catch((err) => {
      console.error('\x1b[31m%s\x1b[0m', 'Error while seeding dates: ', err);
    });
}

function getDates(): Dates[] {
  const startDate = new global.Date(2010, 0, 1);
  const endDate = addYears(Number(startDate), 2);

  const dates = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const slicedDates = dates.slice(0, 730);
  const step = 7;
  const steppedDates = slicedDates.filter((_, index) => index % step === 0);

  const records: Dates[] = steppedDates.map((date: any) => ({
    dateId: parseInt(format(date, 'yyyyMMdd'), 10),
    date: date.toISOString(),
    day: getDate(date),
    dayOfWeek: getDay(date) + 1,
    dayOfYear: getDayOfYear(date),
    weekOfYear: getWeek(date),
    month: getMonth(date) + 1,
    quarter: getQuarter(date),
    year: getYear(date),
  }));

  return records;
}
