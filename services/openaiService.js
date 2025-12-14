const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateRoadmap = async (repoData, scores) => {
  try {
    const prompt = `Analyze this GitHub repository and generate an improvement roadmap:

Repository Name: ${repoData.name}
Owner: ${repoData.owner}
Description: ${repoData.description || 'No description'}
Overall Score: ${scores.overall}/100

Key Metrics:
- Code Quality: ${scores.codeQuality}/100
- Documentation: ${scores.documentation}/100
- Testing: ${scores.testing}/100
- CI/CD: ${scores.ciCd}/100
- Collaboration: ${scores.collaboration}/100

Repository Structure:
- Total Files: ${repoData.totalFiles}
- Languages: ${repoData.languages?.join(', ') || 'Unknown'}
- Has Tests: ${repoData.testAnalysis?.hasTests ? 'Yes' : 'No'}
- Has CI/CD: ${repoData.ciCdAnalysis?.hasCI ? 'Yes' : 'No'}

Generate a personalized 4-week improvement roadmap with:
1. Week-by-week actionable tasks
2. Priority levels (High/Medium/Low)
3. Estimated time for each task
4. Specific tools/libraries to use
5. Success metrics
6. Learning resources

Format the response as a JSON object with this structure:
{
  "summary": "Brief overall assessment",
  "priorityAreas": ["area1", "area2", "area3"],
  "roadmap": [
    {
      "week": 1,
      "theme": "Week theme",
      "tasks": [
        {
          "title": "Task title",
          "description": "Detailed description",
          "priority": "High/Medium/Low",
          "estimatedTime": "2-4 hours",
          "resources": ["url1", "url2"],
          "successCriteria": ["criteria1", "criteria2"]
        }
      ]
    }
  ],
  "recommendedTools": ["tool1", "tool2"],
  "expectedImprovement": "Expected score improvement after implementing"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an experienced software development mentor and technical coach. Create practical, actionable improvement plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 2000
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI roadmap generation error:', error);
    
    // Fallback roadmap if AI fails
    return generateFallbackRoadmap(scores);
  }
};

function generateFallbackRoadmap(scores) {
  const roadmap = {
    summary: "Based on your repository scores, here's a general improvement plan.",
    priorityAreas: [],
    roadmap: [],
    recommendedTools: ["ESLint", "Prettier", "Jest", "GitHub Actions", "Codecov"],
    expectedImprovement: "20-30 points with consistent effort"
  };

  // Identify priority areas
  if (scores.codeQuality < 70) roadmap.priorityAreas.push("Code Quality");
  if (scores.documentation < 70) roadmap.priorityAreas.push("Documentation");
  if (scores.testing < 70) roadmap.priorityAreas.push("Testing");
  if (scores.ciCd < 70) roadmap.priorityAreas.push("CI/CD");

  // Generate 4-week plan
  for (let week = 1; week <= 4; week++) {
    const weekPlan = {
      week: week,
      theme: getWeekTheme(week, scores),
      tasks: getWeekTasks(week, scores)
    };
    roadmap.roadmap.push(weekPlan);
  }

  return roadmap;
}

function getWeekTheme(week, scores) {
  const themes = [
    "Foundation & Code Quality",
    "Testing & Documentation",
    "CI/CD & Automation",
    "Collaboration & Maintenance"
  ];
  return themes[week - 1] || "General Improvement";
}

function getWeekTasks(week, scores) {
  const tasks = [];

  switch(week) {
    case 1:
      tasks.push({
        title: "Set up code linting",
        description: "Configure ESLint/Prettier for consistent code style",
        priority: "High",
        estimatedTime: "1-2 hours",
        resources: ["https://eslint.org/", "https://prettier.io/"],
        successCriteria: ["All new code follows linting rules", "CI fails on linting errors"]
      });
      break;
    case 2:
      tasks.push({
        title: "Improve README",
        description: "Add comprehensive documentation with examples",
        priority: "Medium",
        estimatedTime: "2-3 hours",
        resources: ["https://www.makeareadme.com/"],
        successCriteria: ["README has installation instructions", "Includes code examples"]
      });
      break;
    case 3:
      tasks.push({
        title: "Set up GitHub Actions",
        description: "Create CI pipeline for automated testing",
        priority: "High",
        estimatedTime: "3-4 hours",
        resources: ["https://docs.github.com/en/actions"],
        successCriteria: ["Tests run on every PR", "Build status badges in README"]
      });
      break;
    case 4:
      tasks.push({
        title: "Add contribution guidelines",
        description: "Create CONTRIBUTING.md file",
        priority: "Medium",
        estimatedTime: "1-2 hours",
        resources: ["https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors"],
        successCriteria: ["Clear contribution process", "Code review guidelines"]
      });
      break;
  }

  return tasks;
}

exports.generateCodeReview = async (code, language, context) => {
  try {
    const prompt = `Review this ${language} code and provide detailed feedback:

Code Context: ${context}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide feedback in this structure:
1. **Overall Assessment** (Brief summary)
2. **Strengths** (What's done well)
3. **Areas for Improvement** (Specific issues)
4. **Security Concerns** (If any)
5. **Performance Optimizations** (If needed)
6. **Best Practices** (Suggestions)
7. **Specific Changes** (Line-by-line suggestions if needed)

Be constructive and provide code examples for improvements.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a senior software engineer conducting a code review. Be thorough, constructive, and provide actionable feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI code review error:', error);
    return "Unable to generate code review at this time. Please try again later.";
  }
};

exports.generateSkillExtraction = async (repoData) => {
  try {
    const prompt = `Extract technical skills from this repository analysis:

Repository: ${repoData.name}
Description: ${repoData.description || 'No description'}
Primary Languages: ${repoData.languages?.join(', ') || 'Unknown'}
Key Features:
- Has CI/CD: ${repoData.ciCdAnalysis?.hasCI ? 'Yes' : 'No'}
- Has Tests: ${repoData.testAnalysis?.hasTests ? 'Yes' : 'No'}
- Has Documentation: ${repoData.readmeAnalysis?.exists ? 'Yes' : 'No'}

Extract skills in these categories:
1. Programming Languages & Frameworks
2. Tools & Platforms
3. Development Practices
4. Architecture & Design Patterns
5. Soft Skills (if evident from commit messages/PRs)

For each skill, provide:
- Skill Name
- Confidence Level (High/Medium/Low)
- Evidence (what in the repo demonstrates this skill)
- Suggested Proficiency Level (Beginner/Intermediate/Expert)

Format as JSON array.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a technical recruiter extracting skills from GitHub repositories. Be accurate and evidence-based."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI skill extraction error:', error);
    return [];
  }
};