// Mem0 JavaScript Implementation
// A memory management system for AI applications

class Memory {
    constructor(id, content, metadata = {}) {
        this.id = id;
        this.content = content;
        this.metadata = {
            timestamp: new Date().toISOString(),
            ...metadata
        };
        this.embeddings = null;
        this.tags = metadata.tags || [];
    }

    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    }

    removeTag(tag) {
        this.tags = this.tags.filter(t => t !== tag);
    }

    updateContent(newContent) {
        this.content = newContent;
        this.metadata.lastUpdated = new Date().toISOString();
        this.embeddings = null; // Reset embeddings for re-computation
    }
}

class SimpleEmbedding {
    // Simple text similarity using TF-IDF-like approach
    static tokenize(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 0);
    }

    static computeEmbedding(text) {
        const tokens = this.tokenize(text);
        const freq = {};
        
        tokens.forEach(token => {
            freq[token] = (freq[token] || 0) + 1;
        });

        // Normalize frequencies
        const maxFreq = Math.max(...Object.values(freq));
        const embedding = {};
        
        Object.keys(freq).forEach(token => {
            embedding[token] = freq[token] / maxFreq;
        });

        return embedding;
    }

    static cosineSimilarity(embedding1, embedding2) {
        const keys1 = Object.keys(embedding1);
        const keys2 = Object.keys(embedding2);
        const allKeys = new Set([...keys1, ...keys2]);

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (const key of allKeys) {
            const val1 = embedding1[key] || 0;
            const val2 = embedding2[key] || 0;
            
            dotProduct += val1 * val2;
            norm1 += val1 * val1;
            norm2 += val2 * val2;
        }

        if (norm1 === 0 || norm2 === 0) return 0;
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
}

class Mem0 {
    constructor(config = {}) {
        this.memories = new Map();
        this.config = {
            maxMemories: config.maxMemories || 1000,
            similarityThreshold: config.similarityThreshold || 0.7,
            autoExpire: config.autoExpire || false,
            expireAfterDays: config.expireAfterDays || 30
        };
        this.nextId = 1;
        
        // Initialize cleanup if auto-expire is enabled
        if (this.config.autoExpire) {
            this.startCleanupTimer();
        }
    }

    // Add a new memory
    add(content, metadata = {}) {
        const id = `mem_${this.nextId++}`;
        const memory = new Memory(id, content, metadata);
        
        // Compute embeddings
        memory.embeddings = SimpleEmbedding.computeEmbedding(content);
        
        // Check for duplicates based on similarity
        const similar = this.findSimilar(content, 1);
        if (similar.length > 0 && similar[0].similarity > this.config.similarityThreshold) {
            // Update existing memory instead of creating duplicate
            const existingMemory = similar[0].memory;
            existingMemory.updateContent(content);
            existingMemory.metadata = { ...existingMemory.metadata, ...metadata };
            return existingMemory.id;
        }

        // Add new memory
        this.memories.set(id, memory);
        
        // Enforce memory limit
        if (this.memories.size > this.config.maxMemories) {
            this.evictOldest();
        }

        return id;
    }

    // Get memory by ID
    get(id) {
        return this.memories.get(id) || null;
    }

    // Update existing memory
    update(id, content, metadata = {}) {
        const memory = this.memories.get(id);
        if (!memory) {
            throw new Error(`Memory with id ${id} not found`);
        }

        memory.updateContent(content);
        memory.metadata = { ...memory.metadata, ...metadata };
        memory.embeddings = SimpleEmbedding.computeEmbedding(content);
        
        return memory;
    }

    // Delete memory
    delete(id) {
        return this.memories.delete(id);
    }

    // Search memories by content similarity
    search(query, limit = 10) {
        const queryEmbedding = SimpleEmbedding.computeEmbedding(query);
        const results = [];

        for (const memory of this.memories.values()) {
            const similarity = SimpleEmbedding.cosineSimilarity(
                queryEmbedding,
                memory.embeddings
            );
            
            if (similarity > 0) {
                results.push({
                    memory,
                    similarity,
                    id: memory.id
                });
            }
        }

        return results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
    }

    // Find similar memories to given content
    findSimilar(content, limit = 5) {
        return this.search(content, limit);
    }

    // Search by tags
    searchByTags(tags, matchAll = false) {
        const results = [];
        
        for (const memory of this.memories.values()) {
            const memoryTags = memory.tags || [];
            
            let matches;
            if (matchAll) {
                matches = tags.every(tag => memoryTags.includes(tag));
            } else {
                matches = tags.some(tag => memoryTags.includes(tag));
            }
            
            if (matches) {
                results.push(memory);
            }
        }
        
        return results;
    }

    // Get memories by date range
    getByDateRange(startDate, endDate) {
        const results = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (const memory of this.memories.values()) {
            const memoryDate = new Date(memory.metadata.timestamp);
            if (memoryDate >= start && memoryDate <= end) {
                results.push(memory);
            }
        }
        
        return results.sort((a, b) => 
            new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp)
        );
    }

    // Get all memories
    getAll() {
        return Array.from(this.memories.values())
            .sort((a, b) => 
                new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp)
            );
    }

    // Clear all memories
    clear() {
        this.memories.clear();
        this.nextId = 1;
    }

    // Get memory statistics
    getStats() {
        const memories = Array.from(this.memories.values());
        
        return {
            totalMemories: memories.length,
            memoryLimit: this.config.maxMemories,
            oldestMemory: memories.length > 0 ? 
                Math.min(...memories.map(m => new Date(m.metadata.timestamp))) : null,
            newestMemory: memories.length > 0 ? 
                Math.max(...memories.map(m => new Date(m.metadata.timestamp))) : null,
            totalTags: new Set(memories.flatMap(m => m.tags)).size,
            averageContentLength: memories.length > 0 ? 
                memories.reduce((sum, m) => sum + m.content.length, 0) / memories.length : 0
        };
    }

    // Export memories to JSON
    export() {
        const data = {
            memories: Array.from(this.memories.entries()),
            config: this.config,
            nextId: this.nextId,
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    // Import memories from JSON
    import(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            this.memories.clear();
            this.config = { ...this.config, ...data.config };
            this.nextId = data.nextId || 1;
            
            for (const [id, memoryData] of data.memories) {
                const memory = new Memory(
                    memoryData.id,
                    memoryData.content,
                    memoryData.metadata
                );
                memory.embeddings = memoryData.embeddings;
                memory.tags = memoryData.tags || [];
                this.memories.set(id, memory);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to import memories:', error);
            return false;
        }
    }

    // Private methods
    evictOldest() {
        let oldestId = null;
        let oldestTime = Infinity;
        
        for (const [id, memory] of this.memories.entries()) {
            const time = new Date(memory.metadata.timestamp).getTime();
            if (time < oldestTime) {
                oldestTime = time;
                oldestId = id;
            }
        }
        
        if (oldestId) {
            this.memories.delete(oldestId);
        }
    }

    startCleanupTimer() {
        setInterval(() => {
            this.cleanupExpired();
        }, 24 * 60 * 60 * 1000); // Run daily
    }

    cleanupExpired() {
        if (!this.config.autoExpire) return;
        
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.config.expireAfterDays);
        
        for (const [id, memory] of this.memories.entries()) {
            const memoryDate = new Date(memory.metadata.timestamp);
            if (memoryDate < cutoffDate) {
                this.memories.delete(id);
            }
        }
    }
}

// Usage example and demo
function demo() {
    console.log('=== Mem0 JavaScript Implementation Demo ===\n');
    
    // Initialize Mem0
    const mem = new Mem0({
        maxMemories: 100,
        similarityThreshold: 0.6,
        autoExpire: false
    });

    // Add some memories
    console.log('Adding memories...');
    const id1 = mem.add('The user likes pizza and Italian food', { 
        category: 'preferences',
        tags: ['food', 'preferences'] 
    });
    
    const id2 = mem.add('User mentioned they are learning JavaScript', { 
        category: 'skills',
        tags: ['programming', 'learning'] 
    });
    
    const id3 = mem.add('The user enjoys cooking pasta dishes', { 
        category: 'preferences',
        tags: ['food', 'cooking'] 
    });
    
    console.log(`Added memories with IDs: ${id1}, ${id2}, ${id3}\n`);

    // Search for similar content
    console.log('Searching for food-related memories...');
    const foodMemories = mem.search('food and cooking');
    foodMemories.forEach(result => {
        console.log(`- ${result.memory.content} (similarity: ${result.similarity.toFixed(3)})`);
    });
    console.log();

    // Search by tags
    console.log('Searching by tags [food]...');
    const taggedMemories = mem.searchByTags(['food']);
    taggedMemories.forEach(memory => {
        console.log(`- ${memory.content}`);
    });
    console.log();

    // Get statistics
    console.log('Memory Statistics:');
    const stats = mem.getStats();
    console.log(JSON.stringify(stats, null, 2));
    console.log();

    // Update a memory
    console.log('Updating a memory...');
    mem.update(id1, 'The user loves pizza, pasta, and all Italian cuisine', {
        category: 'preferences',
        tags: ['food', 'preferences', 'italian']
    });
    console.log('Memory updated!\n');

    // Search again to see updated results
    console.log('Searching again after update...');
    const updatedResults = mem.search('italian food');
    updatedResults.forEach(result => {
        console.log(`- ${result.memory.content} (similarity: ${result.similarity.toFixed(3)})`);
    });

    return mem;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Mem0, Memory, SimpleEmbedding };
}

// Run demo if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
    demo();
}