const axios = require('axios');
const { CF_API_URL } = process.env;

class CodeforcesService {
  constructor() {
    this.problemsCache = null;
    this.cacheTimestamp = null;
  }

  async getUserSubmissions(handle) {
    try {
      const response = await axios.get(`${CF_API_URL}user.status?handle=${handle}`);
      return response.data.result;
    } catch (error) {
      console.error('Codeforces API error:', error.message);
      throw new Error('Failed to fetch user submissions');
    }
  }

  async getAllProblems() {
    if (this.problemsCache && Date.now() - this.cacheTimestamp < process.env.CACHE_TTL * 1000) {
      return this.problemsCache;
    }

    try {
      const response = await axios.get(`${CF_API_URL}problemset.problems`);
      this.problemsCache = response.data.result.problems;
      this.cacheTimestamp = Date.now();
      console.log(`Cached ${this.problemsCache.length} problems`);
      return this.problemsCache;
    } catch (error) {
      console.error('Codeforces API error:', error.message);
      throw new Error('Failed to fetch problemset');
    }
  }

  async getProblemDetails(contestId, index) {
    const problems = await this.getAllProblems();
    return problems.find(
      p => p.contestId == contestId && p.index === index
    );
  }
}

module.exports = new CodeforcesService();