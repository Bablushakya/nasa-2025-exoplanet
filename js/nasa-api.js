/**
 * NASA API Integration Service
 * Handles all NASA API interactions for real astronomical data
 */

class NASAAPIService {
    constructor() {
        this.apiKey = CONFIG.NASA_API.API_KEY;
        this.baseUrl = CONFIG.NASA_API.BASE_URL;
        this.cache = new Map();
        this.cacheTimeout = 300000; // 5 minutes
    }

    /**
     * Generic API request handler with caching
     */
    async makeRequest(endpoint, params = {}) {
        const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const url = new URL(endpoint, this.baseUrl);
            url.searchParams.append('api_key', this.apiKey);
            
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`NASA API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error('NASA API Request failed:', error);
            throw error;
        }
    }

    /**
     * Get exoplanet data from NASA Exoplanet Archive
     */
    async getExoplanets(limit = 100, filters = {}) {
        try {
            const params = {
                format: 'json',
                table: 'ps',
                select: 'pl_name,hostname,sy_dist,pl_orbper,pl_rade,pl_masse,pl_eqt,disc_year,discoverymethod',
                order: 'disc_year desc'
            };

            if (limit) params.limit = limit;
            
            // Add filters
            if (filters.discoveryMethod) {
                params.where = `discoverymethod like '%${filters.discoveryMethod}%'`;
            }
            
            if (filters.minYear) {
                const whereClause = params.where ? 
                    `${params.where} and disc_year >= ${filters.minYear}` : 
                    `disc_year >= ${filters.minYear}`;
                params.where = whereClause;
            }

            const data = await this.makeRequest('/TAP/sync', params);
            
            return {
                success: true,
                count: data.length,
                exoplanets: data.map(planet => this.formatExoplanetData(planet)),
                source: 'NASA Exoplanet Archive',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Failed to fetch exoplanets:', error);
            return {
                success: false,
                error: error.message,
                exoplanets: []
            };
        }
    }

    /**
     * Get Astronomy Picture of the Day
     */
    async getAPOD(date = null, count = 1) {
        try {
            const params = {};
            if (date) params.date = date;
            if (count > 1) params.count = count;

            const data = await this.makeRequest('/planetary/apod', params);
            
            return {
                success: true,
                data: Array.isArray(data) ? data : [data],
                source: 'NASA APOD'
            };
        } catch (error) {
            console.error('Failed to fetch APOD:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    /**
     * Get Near Earth Objects data
     */
    async getNearEarthObjects(startDate = null, endDate = null) {
        try {
            const today = new Date();
            const params = {
                start_date: startDate || today.toISOString().split('T')[0],
                end_date: endDate || new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };

            const data = await this.makeRequest('/neo/rest/v1/feed', params);
            
            return {
                success: true,
                data: data,
                source: 'NASA NEO Web Service'
            };
        } catch (error) {
            console.error('Failed to fetch NEO data:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }

    /**
     * Get Mars weather data
     */
    async getMarsWeather() {
        try {
            const data = await this.makeRequest('/insight_weather/', {
                feedtype: 'json',
                ver: '1.0'
            });
            
            return {
                success: true,
                data: data,
                source: 'NASA InSight Mars Weather'
            };
        } catch (error) {
            console.error('Failed to fetch Mars weather:', error);
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }

    /**
     * Format exoplanet data for consistency
     */
    formatExoplanetData(rawData) {
        return {
            name: rawData.pl_name || 'Unknown',
            hostStar: rawData.hostname || 'Unknown',
            distance: parseFloat(rawData.sy_dist) || null,
            orbitalPeriod: parseFloat(rawData.pl_orbper) || null,
            radius: parseFloat(rawData.pl_rade) || null,
            mass: parseFloat(rawData.pl_masse) || null,
            equilibriumTemp: parseFloat(rawData.pl_eqt) || null,
            discoveryYear: parseInt(rawData.disc_year) || null,
            discoveryMethod: rawData.discoverymethod || 'Unknown',
            source: 'NASA Exoplanet Archive'
        };
    }

    /**
     * Search exoplanets by name or characteristics
     */
    async searchExoplanets(query, searchType = 'name') {
        try {
            let params = {
                format: 'json',
                table: 'ps',
                select: 'pl_name,hostname,sy_dist,pl_orbper,pl_rade,pl_masse,pl_eqt,disc_year,discoverymethod'
            };

            switch (searchType) {
                case 'name':
                    params.where = `pl_name like '%${query}%'`;
                    break;
                case 'host':
                    params.where = `hostname like '%${query}%'`;
                    break;
                case 'method':
                    params.where = `discoverymethod like '%${query}%'`;
                    break;
                default:
                    params.where = `pl_name like '%${query}%' or hostname like '%${query}%'`;
            }

            const data = await this.makeRequest('/TAP/sync', params);
            
            return {
                success: true,
                results: data.map(planet => this.formatExoplanetData(planet)),
                query: query,
                searchType: searchType
            };
        } catch (error) {
            console.error('Search failed:', error);
            return {
                success: false,
                error: error.message,
                results: []
            };
        }
    }

    /**
     * Get statistics about exoplanet discoveries
     */
    async getDiscoveryStatistics() {
        try {
            const data = await this.makeRequest('/TAP/sync', {
                format: 'json',
                table: 'ps',
                select: 'disc_year,discoverymethod,count(*) as count',
                where: 'disc_year is not null',
                group: 'disc_year,discoverymethod',
                order: 'disc_year desc'
            });

            return {
                success: true,
                statistics: this.processStatistics(data),
                source: 'NASA Exoplanet Archive'
            };
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
            return {
                success: false,
                error: error.message,
                statistics: null
            };
        }
    }

    /**
     * Process statistics data for visualization
     */
    processStatistics(rawData) {
        const yearlyStats = {};
        const methodStats = {};

        rawData.forEach(item => {
            const year = item.disc_year;
            const method = item.discoverymethod;
            const count = parseInt(item.count);

            // Yearly statistics
            if (!yearlyStats[year]) {
                yearlyStats[year] = 0;
            }
            yearlyStats[year] += count;

            // Method statistics
            if (!methodStats[method]) {
                methodStats[method] = 0;
            }
            methodStats[method] += count;
        });

        return {
            byYear: yearlyStats,
            byMethod: methodStats,
            totalPlanets: Object.values(yearlyStats).reduce((sum, count) => sum + count, 0)
        };
    }
}

// Create global instance
window.nasaAPI = new NASAAPIService();