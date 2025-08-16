
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries in reverse order of creation
  await knex('progress').del();
  await knex('embeddings').del();
  await knex('resources').del();
  await knex('responses').del();
  await knex('attempts').del();
  await knex('enrolments').del();
  await knex('exams').del();
  await knex('questions').del();
  await knex('papers').del();
  await knex('syllabus').del();
  await knex('notes').del();
  await knex('topics').del();
  await knex('chapters').del();
  await knex('courses').del();
  await knex('users').del();

  // --- Create Users ---
  const [teacher] = await knex('users').insert({
    display_name: 'Dr. Evelyn Reed',
    email: 'e.reed@example.com',
    role: 'teacher',
  }).returning('*');

  const [student] = await knex('users').insert({
    display_name: 'Sam Sharma',
    email: 's.sharma@example.com',
    role: 'student',
  }).returning('*');

  // --- Create Course ---
  const [course] = await knex('courses').insert({
    title: 'Class XII Computer Science',
    class: 12,
    subject: 'Computer Science',
    description: 'A comprehensive course covering the CBSE syllabus for Class 12 Computer Science.',
    teacher_id: teacher.id,
    join_code: 'CS12-2025'
  }).returning('*');
  
  // --- Create Enrolment ---
  await knex('enrolments').insert({
    course_id: course.id,
    student_id: student.id,
    teacher_id: teacher.id
  });

  // --- Course Structure ---
  const courseStructure = [
    {
      chapter: { title: 'SQL', order: 1 },
      topics: [
        { title: 'Relational Data Model & SQL', order: 1 },
        { title: 'Aggregate Functions & Joins', order: 2 }
      ]
    },
    {
      chapter: { title: 'Data Structures', order: 2 },
      topics: [
        { title: 'Stacks', order: 1 },
        { title: 'Queues', order: 2 }
      ]
    },
    {
      chapter: { title: 'Computer Networks', order: 3 },
      topics: [
        { title: 'Network Topologies & Devices', order: 1 },
        { title: 'Protocols', order: 2 }
      ]
    }
  ];

  // --- Helper to create questions ---
  const createQuestionsForTopic = (topic_id, topic_title) => {
    const questions = [];
    // 5 MCQs
    for (let i = 1; i <= 5; i++) {
      questions.push({
        topic_id,
        type: 'mcq',
        text: `This is dummy MCQ #${i} for the topic: ${topic_title}. What is the correct option?`,
        options: JSON.stringify({ a: 'Option A', b: 'Option B', c: 'Option C', d: 'Option D' }),
        answer_key: 'a',
        marks: 1,
        difficulty: 'easy',
        source: 'Sample Bank'
      });
    }
    // 2 Short Answer
    for (let i = 1; i <= 2; i++) {
      questions.push({
        topic_id,
        type: 'short',
        text: `This is dummy short answer question #${i} for ${topic_title}. Please explain briefly.`,
        marks: 3,
        difficulty: 'medium',
        source: 'PYQ 2022'
      });
    }
    // 1 Long Answer
    questions.push({
      topic_id,
      type: 'long',
      text: `This is a dummy long answer question for ${topic_title}. Please explain in detail with an example.`,
      marks: 5,
      difficulty: 'hard',
      source: 'Sample Paper 2023'
    });
    return questions;
  };
  
  // --- Populate Chapters, Topics, and Questions ---
  for (const item of courseStructure) {
    const [insertedChapter] = await knex('chapters').insert({
      ...item.chapter,
      course_id: course.id,
    }).returning('*');

    for (const topic of item.topics) {
      const [insertedTopic] = await knex('topics').insert({
        ...topic,
        chapter_id: insertedChapter.id,
      }).returning('*');
      
      const questions = createQuestionsForTopic(insertedTopic.id, insertedTopic.title);
      await knex('questions').insert(questions);
    }
  }
};
