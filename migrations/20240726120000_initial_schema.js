
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Add pgcrypto extension for gen_random_uuid()
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  // Core Schema
  await knex.raw("CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student')");

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('email').unique();
    table.text('phone').unique();
    table.text('display_name');
    table.specificType('role', 'user_role').notNullable().defaultTo('student');
    table.text('photo_url');
    table.jsonb('provider');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('last_login_at', { useTz: true });
  });

  await knex.schema.createTable('courses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('title').notNullable();
    table.integer('class').notNullable();
    table.text('subject').notNullable();
    table.text('description');
    table.uuid('teacher_id').references('id').inTable('users').onDelete('SET NULL');
    table.text('join_code').unique();
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('chapters', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('course_id').references('id').inTable('courses').onDelete('CASCADE').notNullable();
    table.text('title').notNullable();
    table.integer('order').defaultTo(0);
  });

  await knex.schema.createTable('topics', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('chapter_id').references('id').inTable('chapters').onDelete('CASCADE').notNullable();
    table.text('title').notNullable();
    table.integer('order').defaultTo(0);
  });

  // Content Metadata
  await knex.schema.createTable('notes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('class');
    table.text('subject');
    table.text('title');
    table.text('storage_path');
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('syllabus', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('class');
    table.text('subject');
    table.text('title');
    table.text('storage_path');
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('papers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('class');
    table.text('subject');
    table.integer('year');
    table.text('type').checkIn(['pyq', 'sample']);
    table.text('title');
    table.text('storage_path');
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('questions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('topic_id').references('id').inTable('topics').onDelete('CASCADE').notNullable();
    table.text('type').checkIn(['mcq', 'short', 'long']);
    table.text('text').notNullable();
    table.jsonb('options');
    table.text('answer_key');
    table.integer('marks').notNullable().defaultTo(1);
    table.text('difficulty').checkIn(['easy', 'medium', 'hard']);
    table.text('source');
  });

  await knex.schema.createTable('exams', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('course_id').references('id').inTable('courses').onDelete('CASCADE');
    table.uuid('chapter_id').references('id').inTable('chapters').onDelete('CASCADE');
    table.uuid('topic_id').references('id').inTable('topics').onDelete('CASCADE');
    table.text('title').notNullable();
    table.text('type').checkIn(['practice', 'test']);
    table.timestamp('due_date', { useTz: true });
    table.integer('total_marks').defaultTo(0);
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('enrolments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('course_id').references('id').inTable('courses').onDelete('CASCADE').notNullable();
    table.uuid('student_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
    table.uuid('teacher_id').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.unique(['course_id', 'student_id']);
  });

  await knex.schema.createTable('attempts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('exam_id').references('id').inTable('exams').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.text('status').checkIn(['in_progress', 'submitted', 'awaiting_ai']).defaultTo('in_progress');
    table.timestamp('started_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('submitted_at', { useTz: true });
    table.integer('total_score');
  });

  await knex.schema.createTable('responses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('attempt_id').references('id').inTable('attempts').onDelete('CASCADE');
    table.uuid('question_id').references('id').inTable('questions').onDelete('CASCADE');
    table.text('response_text');
    table.text('selected_option');
    table.jsonb('uploads');
    table.integer('ai_score');
    table.text('ai_feedback');
    table.integer('max_marks');
  });

  // Embeddings for RAG
  await knex.schema.createTable('resources', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('course_id').references('id').inTable('courses').onDelete('CASCADE');
    table.text('title');
    table.text('type').checkIn(['notes', 'paper', 'marking_scheme', 'reference']);
    table.text('storage_path');
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('embeddings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('course_id').references('id').inTable('courses').onDelete('CASCADE');
    table.uuid('resource_id').references('id').inTable('resources').onDelete('CASCADE');
    table.text('chunk_text');
    table.specificType('embedding_vector', 'double precision[]');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  // Progress denormalization
  await knex.schema.createTable('progress', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('enrolment_id').references('id').inTable('enrolments').onDelete('CASCADE');
    table.decimal('topic_pct');
    table.decimal('chapter_pct');
    table.decimal('course_pct');
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Drop tables in reverse order of creation
  await knex.schema.dropTableIfExists('progress');
  await knex.schema.dropTableIfExists('embeddings');
  await knex.schema.dropTableIfExists('resources');
  await knex.schema.dropTableIfExists('responses');
  await knex.schema.dropTableIfExists('attempts');
  await knex.schema.dropTableIfExists('enrolments');
  await knex.schema.dropTableIfExists('exams');
  await knex.schema.dropTableIfExists('questions');
  await knex.schema.dropTableIfExists('papers');
  await knex.schema.dropTableIfExists('syllabus');
  await knex.schema.dropTableIfExists('notes');
  await knex.schema.dropTableIfExists('topics');
  await knex.schema.dropTableIfExists('chapters');
  await knex.schema.dropTableIfExists('courses');
  await knex.schema.dropTableIfExists('users');

  // Drop custom types
  await knex.raw('DROP TYPE IF EXISTS user_role');
};
