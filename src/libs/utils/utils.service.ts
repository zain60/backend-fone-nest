

// function groupSlots(slots: { time: string }[]): { startTime: string, endTime: string }[] {
//   if (!Array.isArray(slots)) {
//     throw new Error('slots must be an array');
//   }

//   slots.forEach(slot => {
//     if (!slot.time) {
//       throw new Error('Each slot must have a "time" property');
//     }
//   });

//   console.log("OUT -------->", slots);

//   // Sort the slots by time in ascending order
//   slots.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
//   console.log("OUT --------> 1");

//   const groupedSlots: { startTime: string, endTime: string }[] = [];
//   let currentGroupStart = slots[0].time;
//   let currentGroupEnd = slots[0].time;

//   // Iterate through the slots and group them based on time gaps
//   for (let i = 1; i < slots.length; i++) {
//     console.log("OUT --------> 2");

//     const currentSlotTime = new Date(slots[i].time);
//     const previousSlotTime = new Date(slots[i - 1].time);

//     // Check if the current slot is continuous (e.g., no gap between times)
//     const timeDifference = (currentSlotTime.getTime() - previousSlotTime.getTime()) / (1000 * 60); 

//     if (timeDifference <= 30) {
//       // Continue the current group
//       currentGroupEnd = slots[i].time;
//     } else {
//       // There's a gap, so we finish the current group and start a new one
//       groupedSlots.push({
//         startTime: currentGroupStart,
//         endTime: currentGroupEnd,
//       });

//       // Start a new group
//       currentGroupStart = slots[i].time;
//       currentGroupEnd = slots[i].time;
//     }
//   }

//   // Push the last group into the result
//   groupedSlots.push({
//     startTime: currentGroupStart,
//     endTime: currentGroupEnd,
//   });

//   console.log("OUT --------> Grouped Slots:", groupedSlots);
//   return groupedSlots;
// }


// export function groupTimeslotsByDate(slots: Record<string, { time: string }[]>) {
//   const groupedData: Record<string, { startTime: string, endTime: string }[]> = {};
//   for (const date in slots) {
//     if (slots.hasOwnProperty(date)) {
//       groupedData[date] = groupSlots(slots[date]);
//     }
//   }

//   return groupedData;
// }