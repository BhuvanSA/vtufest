-- CreateTable
CREATE TABLE "feedbacks" (
    "feedback_id" SERIAL NOT NULL,
    "reviewer_id" INTEGER,
    "team_id" INTEGER,
    "field1_rating" SMALLINT,
    "field2_rating" SMALLINT,
    "field3_rating" SMALLINT,
    "field4_rating" SMALLINT,
    "field5_rating" SMALLINT,
    "average_rating" REAL,
    "feedback" VARCHAR(255),

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("feedback_id")
);

-- CreateTable
CREATE TABLE "reviewer" (
    "reviewer_id" SERIAL NOT NULL,
    "reviewer_name" VARCHAR(30),
    "review_time" TIMESTAMP(6),

    CONSTRAINT "reviewer_pkey" PRIMARY KEY ("reviewer_id")
);

-- CreateTable
CREATE TABLE "team" (
    "team_id" SERIAL NOT NULL,
    "team_number" INTEGER,

    CONSTRAINT "team_pkey" PRIMARY KEY ("team_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "team_team_number_key" ON "team"("team_number");

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "reviewer"("reviewer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

