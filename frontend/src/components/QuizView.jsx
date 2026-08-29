// LearnPath AI - 5-Level Skill Assessment System (Clean Modern Light SaaS)
function QuizView({ user, setActiveTab }) {
  const API_BASE = 'http://localhost:8085';

  const [activeDomain, setActiveDomain] = React.useState('aiml');
  const [selectedLevel, setSelectedLevel] = React.useState(1);
  const [unlockedLevels, setUnlockedLevels] = React.useState({
    dsa: 5,
    db: 5,
    sysdesign: 5,
    devops: 5,
    java: 5,
    aiml: 5
  });

  const DOMAIN_LEVEL_QUESTIONS = {
    aiml: {
      1: [
        { id: 611, question: "What is a Tensor in PyTorch?", options: ["A multi-dimensional array similar to NumPy ndarray with GPU acceleration support", "A type of database index", "A loss function", "A compiler optimization"], correctIndex: 0, explanation: "Tensors are fundamental data structures in PyTorch enabling autograd and CUDA execution." },
        { id: 612, question: "What is the primary function of an activation function like ReLU?", options: ["Introduce non-linearity so deep neural networks can learn complex decision boundaries", "Normalize weights to zero", "Speed up CPU disk I/O", "Replace the loss function"], correctIndex: 0, explanation: "Without non-linear activations, stacking linear layers collapses into a single linear regression." },
        { id: 613, question: "What does learning rate control during Gradient Descent?", options: ["The step size taken in the direction of the negative gradient towards minimal loss", "The number of hidden layers", "The batch size on disk", "The vocabulary size"], correctIndex: 0, explanation: "Learning rate dictates how aggressively model parameters update each step." },
        { id: 614, question: "In supervised learning, what is the difference between classification and regression?", options: ["Classification predicts discrete labels, while regression predicts continuous numerical values", "They are identical", "Classification requires no labels", "Regression only works on images"], correctIndex: 0, explanation: "Classification categorizes into discrete classes, regression fits continuous outputs." },
        { id: 615, question: "What is overfitting in machine learning models?", options: ["When a model memorizes training data noise and fails to generalize to unseen test data", "When loss is too high on training set", "When the model is too small", "When training runs too fast"], correctIndex: 0, explanation: "Overfitting occurs when model capacity is too high relative to training sample variety." }
      ],
      2: [
        { id: 621, question: "In PyTorch, what is the key difference between tensor.detach() and tensor.clone()?", options: ["detach() shares memory without autograd; clone() copies memory and keeps gradients", "They are identical", "clone() detaches autograd", "detach() runs on GPU only"], correctIndex: 0, explanation: "detach() creates a view without computational graph history; clone() performs deep copy while preserving autograd." },
        { id: 622, question: "In Transformer self-attention, why are dot products scaled by 1/sqrt(d_k)?", options: ["To prevent dot products from growing excessively large and causing vanishing softmax gradients", "To reduce matrix dimension", "To enforce matrix symmetry", "To enable batch normalization"], correctIndex: 0, explanation: "Large magnitude values push softmax into flat regions with tiny gradients." },
        { id: 623, question: "What does LoRA (Low-Rank Adaptation) freeze and train during LLM fine-tuning?", options: ["Freezes base model weights and trains rank decomposition matrices A and B", "Freezes only tokenizer", "Trains only embedding layer", "Fine-tunes every layer fully"], correctIndex: 0, explanation: "LoRA injects trainable rank decomposition matrices while keeping base weights frozen." },
        { id: 624, question: "In Vector Search, what is the primary advantage of HNSW index?", options: ["Provides logarithmic search complexity with high recall for approximate nearest neighbor", "Requires zero RAM", "Guarantees exact linear search", "Replaces embeddings with TF-IDF"], correctIndex: 0, explanation: "HNSW multi-layer graphs deliver ultra-fast logarithmic search." },
        { id: 625, question: "Why is Cross-Entropy Loss preferred over MSE for multi-class classification?", options: ["It penalizes confident incorrect predictions exponentially and avoids gradient saturation with Softmax", "It is easier to compute on CPU", "MSE cannot handle numbers > 1", "Cross-entropy requires no labels"], correctIndex: 0, explanation: "Softmax + Cross-Entropy gradient simplifies to (p - y), avoiding flat plateaus." }
      ],
      3: [
        { id: 631, question: "In RAG pipelines, how does Cross-Encoder Reranking improve retrieval accuracy over bi-encoder vector similarity?", options: ["It processes query and candidate chunk jointly through full cross-attention layers", "It computes hash collisions", "It converts text to SQL", "It removes embedding dimensions"], correctIndex: 0, explanation: "Cross-encoders evaluate deep inter-token attention between query and passage at the cost of higher latency." },
        { id: 632, question: "What is FlashAttention and how does it reduce Transformer memory overhead?", options: ["Tiles attention computation in fast GPU SRAM to avoid read/write bottleneck to high-bandwidth HBM", "Disables attention heads", "Quantizes weights to 1-bit", "Removes softmax entirely"], correctIndex: 0, explanation: "FlashAttention optimizes GPU IO memory hierarchy with fused tiling kernels." },
        { id: 633, question: "What problem does RoPE (Rotary Position Embeddings) solve in modern LLMs like LLaMA?", options: ["Encodes relative positional distance directly into query-key dot products via complex rotational matrices", "Fixes max sequence length to 512", "Replaces attention with CNNs", "Removes positional embeddings"], correctIndex: 0, explanation: "RoPE enables natural relative distance decay and extrapolates to longer context windows." },
        { id: 634, question: "What is the difference between DPO (Direct Preference Optimization) and RLHF with PPO?", options: ["DPO derives closed-form loss directly on preference pairs without training a separate reward model or PPO loop", "DPO requires 10x more GPUs", "RLHF has no reward model", "DPO only works on vision models"], correctIndex: 0, explanation: "DPO mathematically reparameterizes the reward function directly in terms of policy probabilities." },
        { id: 635, question: "In speculative decoding for LLM inference, how is generation accelerated?", options: ["A smaller draft model generates K candidate tokens which are verified in parallel by the target LLM in one forward pass", "It runs on 8-bit quantized CPUs", "It skips half the Transformer layers", "It caches all possible token permutations"], correctIndex: 0, explanation: "Parallel verification of drafted tokens yields 2-3x speedup with zero loss in mathematical precision." }
      ],
      4: [
        { id: 641, question: "How do you mitigate 'Lost in the Middle' phenomena in long-context LLM retrieval?", options: ["Reorder relevant retrieved chunks to the extreme beginning and end of the context window or use rerankers", "Increase temperature to 1.0", "Truncate all context to 100 tokens", "Disable system prompts"], correctIndex: 0, explanation: "LLMs attend strongest to beginning and end of long prompts." },
        { id: 642, question: "In multi-tenant vector databases, what is the best strategy for strict data isolation?", options: ["Namespaces or metadata filtering combined with partitioned HNSW graphs", "Creating 1 database per user", "Storing embeddings as plain text in SQLite", "Disabling index creation"], correctIndex: 0, explanation: "Namespaces and tenant metadata filters prevent cross-tenant vector leakage." },
        { id: 643, question: "When evaluating RAG systems with Ragas metrics, what does 'Context Faithfulness' measure?", options: ["Whether the answer was derived strictly from retrieved context without hallucinations", "Search latency", "Embedding dimension size", "Tokens per second"], correctIndex: 0, explanation: "Faithfulness checks claim-by-claim adherence to retrieved passages." },
        { id: 644, question: "What is KV-Cache in LLM autoregressive generation, and why is PagedAttention used?", options: ["Caches Key and Value matrices across decoding steps; PagedAttention eliminates memory fragmentation like OS virtual memory", "Caches user passwords", "Compiles PyTorch models to C++", "Compresses dataset files on disk"], correctIndex: 0, explanation: "PagedAttention allocates non-contiguous physical memory blocks for KV tensors." },
        { id: 645, question: "How does GraphRAG improve over naive chunk-based RAG for complex multi-hop reasoning?", options: ["Constructs knowledge graphs and community summaries linking entities across disparate documents", "Stores only graph images", "Replaces LLMs with Dijkstra's algorithm", "Avoids vector embeddings completely"], correctIndex: 0, explanation: "GraphRAG captures global themes and relational paths between distant entities." }
      ],
      5: [
        { id: 651, question: "In ZeRO-3 (Zero Redundancy Optimizer), what model states are partitioned across all GPUs?", options: ["Optimizer states, gradients, and model parameters", "Only optimizer states", "Only activation caches", "Only tokenizer weights"], correctIndex: 0, explanation: "ZeRO-3 shards all 3 primary state components across distributed ranks." },
        { id: 652, question: "In vLLM, how does continuous batching (iteration-level scheduling) maximize throughput?", options: ["Evicts completed sequences and admits new requests at individual token generation iterations rather than waiting for entire batches", "Batches 1 million tokens offline", "Disables GPU caching", "Runs requests strictly sequentially"], correctIndex: 0, explanation: "Iteration-level scheduling eliminates idle GPU compute bubbles caused by early-finishing requests." },
        { id: 653, question: "What is the mathematical formulation of GQA (Grouped-Query Attention) vs MHA and MQA?", options: ["Multiple query heads share a single key-value head per group, balancing quality and memory bandwidth", "Every query head has its own KV head", "Only 1 single query head exists", "Attention is computed without keys"], correctIndex: 0, explanation: "GQA groups query heads to drastically reduce KV cache size while retaining near-MHA accuracy." },
        { id: 654, question: "How does Mixture-of-Experts (MoE) achieve higher capacity with constant FLOPs per token?", options: ["A top-k gating router activates only a subset of expert feed-forward networks per token", "All experts compute all tokens concurrently", "Experts are run on separate client machines", "MoE disables feedforward layers"], correctIndex: 0, explanation: "Sparse MoE routes each token to only top-1 or top-2 expert sub-networks." },
        { id: 655, question: "What causes catastrophic forgetting in continual LLM pre-training, and how is it mitigated?", options: ["New task gradients overwrite previous weight representations; mitigated via replay buffer data mixing and parameter isolation", "RAM exhaustion", "CUDA driver crash", "Softmax underflow"], correctIndex: 0, explanation: "Mixing 5-10% of historical pre-training tokens preserves foundational capabilities during domain adaptation." }
      ]
    },
    java: {
      1: [
        { id: 711, question: "What is the difference between JDK, JRE, and JVM in Java?", options: ["JDK contains tools + JRE; JRE contains JVM + libraries; JVM executes compiled bytecode", "They are identical", "JVM is only for Windows", "JDK is a database"], correctIndex: 0, explanation: "JDK compiles source code, JRE provides libraries, JVM executes bytecode." },
        { id: 712, question: "What is the difference between equals() and == for Objects in Java?", options: ["== checks memory reference equality; equals() compares logical state content", "== is for strings only", "equals() cannot be overridden", "They always return the same result"], correctIndex: 0, explanation: "== compares memory addresses unless overridden like equals() in String." },
        { id: 713, question: "Why is String immutable in Java?", options: ["For security, thread-safety, String pool caching, and consistent hashCode calculations", "Because JVM cannot reallocate memory", "To prevent subclassing", "Because char arrays are immutable"], correctIndex: 0, explanation: "Immutability ensures Strings are safe for multithreading and HashMap keys." },
        { id: 714, question: "What is the difference between ArrayList and LinkedList in Java?", options: ["ArrayList is backed by dynamic array with O(1) random access; LinkedList is doubly-linked with O(N) lookup", "LinkedList has faster random access", "ArrayList cannot hold objects", "They have identical internal structures"], correctIndex: 0, explanation: "ArrayList provides fast index lookup, LinkedList allows fast head/tail insertion." },
        { id: 715, question: "What is the purpose of the final keyword in Java?", options: ["Prevents variable reassignment, method overriding, or class inheritance", "Deletes the variable from memory", "Makes methods asynchronous", "Enforces static execution"], correctIndex: 0, explanation: "final constants cannot be changed, final methods cannot be overridden, final classes cannot be extended." }
      ],
      2: [
        { id: 721, question: "In Java 21, how do Virtual Threads achieve high concurrency with blocking I/O?", options: ["Carrier OS threads unmount virtual threads during blocking calls and execute other tasks", "They create 1 kernel thread per virtual thread", "They disable garbage collection", "They run on the GPU"], correctIndex: 0, explanation: "Project Loom unmounts virtual threads from carrier threads when blocking, allowing millions of concurrent tasks." },
        { id: 722, question: "What is the N+1 Query Problem in Spring Data JPA / Hibernate, and how is it resolved?", options: ["Executing 1 parent query and N child queries; resolved using JOIN FETCH or @EntityGraph", "A syntax error in JPQL", "Running N+1 transactions", "A database connection leak"], correctIndex: 0, explanation: "JOIN FETCH retrieves parent and related entities in a single SQL query." },
        { id: 723, question: "How does ConcurrentHashMap achieve high write throughput in Java 8+?", options: ["Locks individual bucket nodes using synchronized/CAS rather than entire segment arrays", "Uses a single global lock", "Disables hashing collisions", "Writes everything to disk"], correctIndex: 0, explanation: "Java 8 ConcurrentHashMap uses synchronized on bucket head nodes + CAS operations." },
        { id: 724, question: "What is the difference between @Component, @Service, and @Repository in Spring?", options: ["@Repository adds automatic persistence exception translation; @Service and @Component are semantic stereotypes", "They have different bean lifecycles", "@Service cannot have dependencies", "@Component is deprecated"], correctIndex: 0, explanation: "@Repository enables Spring DataAccessException translation post-processors." },
        { id: 725, question: "In Apache Kafka, what happens when a consumer group has more consumers than topic partitions?", options: ["Excess consumers remain idle with zero partitions assigned", "Partitions are duplicated", "Kafka throws an exception", "Messages are split across consumers"], correctIndex: 0, explanation: "A single partition can only be consumed by at most one consumer per consumer group." }
      ],
      3: [
        { id: 731, question: "In Spring Framework, how does @Transactional handle exceptions by default?", options: ["Rolls back on unchecked RuntimeExceptions and Errors, but commits on checked Exceptions unless specified", "Rolls back on all exceptions", "Never rolls back", "Throws NullPointerException"], correctIndex: 0, explanation: "rollbackFor = Exception.class must be configured to roll back on checked exceptions." },
        { id: 732, question: "How does the ZGC (Z Garbage Collector) achieve sub-millisecond pause times in modern Java?", options: ["Performs concurrent marking and relocation using colored pointers and load barriers", "Stops the entire JVM for 10 seconds", "Disables heap allocations", "Runs on GPU threads"], correctIndex: 0, explanation: "ZGC does almost all GC phases concurrently without stopping application threads." },
        { id: 733, question: "In Kafka consumer design, how do you prevent consumer group rebalance storms during long processing tasks?", options: ["Process messages asynchronously in thread pools and decouple heartbeat from record processing with max.poll.interval.ms", "Set timeout to 0", "Disable partitions", "Restart broker"], correctIndex: 0, explanation: "Increasing max.poll.interval.ms and using worker queues avoids session timeouts." },
        { id: 734, question: "What is the difference between optimistic and pessimistic locking in Spring JPA?", options: ["Optimistic uses @Version column checking on commit; pessimistic locks database rows with SELECT FOR UPDATE", "Optimistic is always slower", "Pessimistic does not lock rows", "They are identical"], correctIndex: 0, explanation: "Optimistic locking avoids database lock contention under low write conflict scenarios." },
        { id: 735, question: "What is the purpose of Spring WebFlux Reactive streams vs standard Spring MVC?", options: ["Non-blocking asynchronous I/O using Netty event loops handling high concurrent connections with minimal threads", "Faster CPU matrix math", "Replaces PostgreSQL with files", "Removes REST APIs"], correctIndex: 0, explanation: "Reactive backpressure and event loops handle high I/O concurrency with fixed thread pools." }
      ]
    },
    db: {
      1: [
        { id: 111, question: "What is the difference between PRIMARY KEY and UNIQUE constraint in SQL?", options: ["A table can have only one PRIMARY KEY which disallows NULLs; multiple UNIQUE constraints can exist and allow NULLs", "They are identical", "UNIQUE cannot be indexed", "PRIMARY KEY allows duplicate rows"], correctIndex: 0, explanation: "Primary keys uniquely identify rows and cannot be NULL; UNIQUE allows unique values with possible NULLs." },
        { id: 112, question: "Which SQL command is used to remove all records from a table without logging individual row deletions?", options: ["TRUNCATE TABLE", "DELETE FROM", "DROP TABLE", "REMOVE TABLE"], correctIndex: 0, explanation: "TRUNCATE is a DDL operation that deallocates data pages quickly." },
        { id: 113, question: "What does the WHERE clause do compared to HAVING clause in SQL?", options: ["WHERE filters rows before aggregation; HAVING filters groups after GROUP BY aggregation", "WHERE is only for numbers", "HAVING cannot use aggregate functions", "They are interchangeable"], correctIndex: 0, explanation: "WHERE filters individual table rows; HAVING filters grouped summary results." },
        { id: 114, question: "Which JOIN returns all records from both tables matching when possible?", options: ["FULL OUTER JOIN", "INNER JOIN", "CROSS JOIN", "LEFT JOIN"], correctIndex: 0, explanation: "FULL OUTER JOIN includes unmatched rows from both left and right sides." },
        { id: 115, question: "What does ACID stand for in database transactions?", options: ["Atomicity, Consistency, Isolation, Durability", "Asynchronous, Concurrent, Indexed, Distributed", "Auto, Cache, Insert, Delete", "Authentication, Checksum, Integrity, Data"], correctIndex: 0, explanation: "ACID guarantees transactional correctness and crash recovery." }
      ],
      2: [
        { id: 121, question: "What is the difference between RANK() and DENSE_RANK() in SQL window functions?", options: ["DENSE_RANK produces consecutive numbers without gaps for ties", "RANK is faster", "DENSE_RANK requires PARTITION BY", "They are identical"], correctIndex: 0, explanation: "DENSE_RANK assigns consecutive integers (e.g. 1, 2, 2, 3) without skipping rank positions." },
        { id: 122, question: "Which JOIN returns all rows from the left table regardless of whether there is a match in the right table?", options: ["LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "CROSS JOIN"], correctIndex: 0, explanation: "LEFT JOIN retains every record from the left table with NULL values for unmatched right rows." },
        { id: 123, question: "Which isolation level in PostgreSQL/MySQL prevents Phantom Reads?", options: ["SERIALIZABLE", "REPEATABLE READ", "READ COMMITTED", "READ UNCOMMITTED"], correctIndex: 0, explanation: "SERIALIZABLE uses strict predicate locking or Serializable Snapshot Isolation (SSI)." },
        { id: 124, question: "In a B+ Tree index, why are range queries significantly faster than in a regular B-Tree?", options: ["All leaf nodes form a doubly linked list allowing sequential block scans", "B+ Trees have no root node", "B+ Trees avoid hashing", "B+ Trees fit entirely in L1 cache"], correctIndex: 0, explanation: "Leaf node linked pointers allow fast sequential iteration without traversing back up the tree." },
        { id: 125, question: "What happens during a PostgreSQL MVCC Vacuum operation?", options: ["Reclaims dead tuple space created by UPDATE/DELETE operations", "Rebuilds all indexes from scratch", "Drops foreign keys", "Locks entire table exclusively"], correctIndex: 0, explanation: "Vacuum cleans dead row versions so pages can be reused by new inserts." }
      ],
      3: [
        { id: 131, question: "What is a Covering Index (Index-Only Scan) in PostgreSQL/MySQL?", options: ["An index containing all columns requested in the query, eliminating the need to read table heap pages", "An index on all table columns", "A primary key index", "An encrypted index"], correctIndex: 0, explanation: "Index-only scans satisfy queries directly from RAM index pages without visiting heap tuples." },
        { id: 132, question: "How does Write-Ahead Logging (WAL) ensure durability in relational databases?", options: ["Changes are recorded sequentially to append-only disk logs before dirty buffer pages are flushed to table files", "Writes directly to RAM only", "Disables caching", "Logs queries to stdout"], correctIndex: 0, explanation: "WAL guarantees transactions can be replayed and reconstructed after power loss." },
        { id: 133, question: "What causes index bloat and table bloat in high-update PostgreSQL databases?", options: ["MVCC writes new row versions on every UPDATE without in-place modification, leaving dead tuples until vacuumed", "Index keys growing too long", "Too many SELECT queries", "Corrupted foreign keys"], correctIndex: 0, explanation: "PostgreSQL MVCC does out-of-place updates creating dead tuples that require vacuum maintenance." },
        { id: 134, question: "In distributed databases, what is the difference between sharding and replication?", options: ["Sharding partitions distinct dataset subsets across nodes; replication copies the full dataset across nodes for redundancy", "Sharding is only for Redis", "Replication divides data", "They are identical"], correctIndex: 0, explanation: "Sharding scales write capacity and storage horizontally; replication provides read scale and fault tolerance." },
        { id: 135, question: "What is the difference between Clustered and Non-Clustered Indexes in MySQL InnoDB?", options: ["The Clustered index dictates physical row order on disk (Primary Key); Non-clustered indexes store secondary keys pointing to primary keys", "Clustered indexes are slower", "Non-clustered indexes store table rows", "InnoDB has no clustered indexes"], correctIndex: 0, explanation: "InnoDB tables are organized as clustered B+ trees on the primary key." }
      ]
    },
    sysdesign: {
      1: [
        { id: 311, question: "What is the difference between Vertical Scaling (Scale Up) and Horizontal Scaling (Scale Out)?", options: ["Vertical adds more CPU/RAM to a single server; Horizontal adds more server instances to distribute load", "Horizontal means buying a larger server", "Vertical has no limits", "They are identical"], correctIndex: 0, explanation: "Horizontal scaling distributes traffic across multiple commodity machines." },
        { id: 312, question: "What is the primary role of a Reverse Proxy like NGINX?", options: ["Intercepts client requests, routes them to backend servers, and handles SSL termination and load balancing", "Stores database records", "Compiles frontend React code", "Encrypts client hard drives"], correctIndex: 0, explanation: "Reverse proxies route traffic, terminate SSL, and cache static assets." },
        { id: 313, question: "What is a Content Delivery Network (CDN)?", options: ["A globally distributed network of edge cache servers serving static assets close to end users", "A relational database", "A DNS registrar", "A code repository"], correctIndex: 0, explanation: "CDNs cache static media and data at geographical edge nodes, cutting latency." },
        { id: 314, question: "What is the difference between synchronous and asynchronous communication in microservices?", options: ["Synchronous blocks waiting for response (REST/gRPC); Asynchronous publishes messages without blocking (Kafka/RabbitMQ)", "Synchronous is always faster", "Asynchronous does not use network", "They have identical latency"], correctIndex: 0, explanation: "Asynchronous messaging decouples producers and consumers for resilient scaling." },
        { id: 315, question: "What is database connection pooling and why is it essential?", options: ["Maintains a cache of open database connections to avoid the expensive TCP/TLS handshake on every request", "Creates 1 database per user", "Disables database locks", "Encrypts query strings"], correctIndex: 0, explanation: "Connection pools reuse established DB connections under high concurrency." }
      ],
      2: [
        { id: 321, question: "What does the CAP theorem state regarding distributed systems during network partitions (P)?", options: ["A distributed system must choose between Consistency (C) or Availability (A)", "A system can guarantee all three simultaneously", "Partition tolerance can be eliminated", "Latency equals consistency"], correctIndex: 0, explanation: "When network splits occur, you must choose between stale available responses or strict consistent errors." },
        { id: 322, question: "How does Consistent Hashing minimize data movement when a node is added or removed?", options: ["Only keys mapped to the specific ring segment between adjacent nodes are relocated", "Rehashes all N keys uniformly", "Replicates every key to all nodes", "Eliminates hash collisions completely"], correctIndex: 0, explanation: "On average, only K/N keys need remapping when node count changes." },
        { id: 323, question: "Which caching strategy writes to cache and database concurrently before returning to the client?", options: ["Write-Through", "Write-Back (Write-Behind)", "Cache-Aside", "Read-Through"], correctIndex: 0, explanation: "Write-Through updates cache and persistent store synchronously." },
        { id: 324, question: "What is the primary benefit of the Token Bucket algorithm over Fixed Window counters for rate limiting?", options: ["Smooths out traffic bursts by allowing burst up to bucket capacity", "Never drops any requests", "Requires zero memory", "Runs entirely on the client"], correctIndex: 0, explanation: "Token bucket handles sudden bursts smoothly while maintaining a constant average refill rate." },
        { id: 325, question: "In event-driven microservices, what problem does the Transactional Outbox Pattern solve?", options: ["Guarantees atomic database update and message broker publish without distributed 2PC locks", "Encrypts messages in Kafka", "Eliminates duplicate HTTP calls", "Replaces relational DB with Redis"], correctIndex: 0, explanation: "Stores events in an outbox table within the same local DB transaction, polled by an event relay." }
      ],
      3: [
        { id: 331, question: "What is the difference between Strong Consistency, Eventual Consistency, and Read-Your-Own-Writes Consistency?", options: ["Strong guarantees instant global state; Eventual converges over time; Read-Your-Own-Writes guarantees a user sees their recent updates", "They are identical", "Eventual consistency never updates", "Strong consistency has no latency penalty"], correctIndex: 0, explanation: "Consistency models trade off synchronization latency against data freshness guarantees." },
        { id: 332, question: "How does the Raft consensus algorithm handle leader election when split votes occur?", options: ["Uses randomized election timeouts per node so one candidate times out and requests votes first", "Selects the node with lowest IP", "Restarts the cluster", "Requires manual intervention"], correctIndex: 0, explanation: "Randomized timeouts break split vote ties naturally." },
        { id: 333, question: "In distributed caching, what is the Thundering Herd (Cache Stampede) problem, and how is it resolved?", options: ["Massive concurrent requests hit the database when a popular cache key expires; resolved with mutex locking or probabilistic early expiration", "Hardware CPU failure", "Network cable disconnection", "Database memory leak"], correctIndex: 0, explanation: "Mutual exclusion locks on cache miss allow only one thread to populate cache while others wait." },
        { id: 334, question: "What is the difference between Gossip Protocol and Centralized Coordinator (like ZooKeeper/etcd)?", options: ["Gossip is decentralized peer-to-peer eventual state dissemination; etcd uses centralized quorum consensus", "Gossip is strictly synchronous", "etcd has no leader", "Gossip requires shared memory"], correctIndex: 0, explanation: "Gossip protocols scale to thousands of nodes with probabilistic discovery (e.g. Cassandra/DynamoDB)." },
        { id: 335, question: "How does the Circuit Breaker pattern (Resilience4j) protect distributed microservices under failure?", options: ["Transitions to OPEN state upon reaching failure threshold to fail fast and prevent thread pool exhaustion", "Restarts the cloud region", "Drops client SSL certs", "Reroutes all traffic to disk"], correctIndex: 0, explanation: "Circuit breakers prevent cascading outages by short-circuiting calls to degraded downstream services." }
      ]
    },
    devops: {
      1: [
        { id: 411, question: "What is the difference between a Container (Docker) and a Virtual Machine (VM)?", options: ["Containers share the host OS kernel and are lightweight; VMs run full guest OS on a hypervisor", "Containers require a dedicated hypervisor", "VMs start in milliseconds", "They are identical"], correctIndex: 0, explanation: "Containers isolate processes using Linux namespaces and cgroups, sharing the host kernel." },
        { id: 412, question: "What is the purpose of a Dockerfile?", options: ["A text blueprint containing sequential instructions to build an automated container image", "A log file", "A shell terminal", "A network router config"], correctIndex: 0, explanation: "Dockerfiles define OS base layers, dependencies, and entrypoints for container builds." },
        { id: 413, question: "What is CI/CD in modern software engineering?", options: ["Continuous Integration (automated test & build) and Continuous Deployment (automated release to staging/prod)", "Code Indexing and Compression", "Cloud Infrastructure on Disk", "Client Interface Component"], correctIndex: 0, explanation: "CI/CD automates linting, testing, image building, and production deployment." },
        { id: 414, question: "In Kubernetes, what is a Pod?", options: ["The smallest deployable compute unit consisting of one or more tightly-coupled containers sharing network/storage", "A physical server", "A database table", "A Docker registry"], correctIndex: 0, explanation: "Pods encapsulate container instances, storage resources, and unique IP addresses." },
        { id: 415, question: "What is the primary role of DNS (Domain Name System)?", options: ["Translates human-readable domain names (e.g. google.com) into numerical IP addresses", "Encrypts web passwords", "Compiles source code", "Executes SQL queries"], correctIndex: 0, explanation: "DNS resolves domain names to IP addresses for network routing." }
      ],
      2: [
        { id: 421, question: "What is the purpose of Kubernetes Pod Readiness Probes versus Liveness Probes?", options: ["Readiness determines if traffic should be routed to the Pod; Liveness restarts crashed containers", "They are completely identical", "Readiness probe terminates the node", "Liveness probe creates a load balancer"], correctIndex: 0, explanation: "Readiness controls service endpoint routing; liveness restarts unhealthy container processes." },
        { id: 422, question: "In Docker, what is the best practice for keeping production image sizes minimal?", options: ["Multi-stage builds to discard build toolchains from the final runtime container", "Installing all compilers", "Using Ubuntu base images", "Disabling layer caching"], correctIndex: 0, explanation: "Multi-stage builds copy only compiled binaries into lean distroless/alpine runtime images." },
        { id: 423, question: "What makes Terraform an 'Idempotent' Infrastructure-as-Code tool?", options: ["Applying the same configuration multiple times produces the exact same state without unintended side effects", "Runs only on AWS", "Does not store state files", "Executes scripts sequentially"], correctIndex: 0, explanation: "Terraform compares desired state against real infrastructure state and applies only necessary diffs." },
        { id: 424, question: "What is the purpose of an AWS IAM Role compared to IAM User credentials?", options: ["Provides temporary, auto-rotated security credentials without hardcoded access keys", "Used only for billing", "Has unlimited root access", "Cannot be attached to EC2"], correctIndex: 0, explanation: "Roles issue temporary STS credentials, eliminating hardcoded long-lived secrets." },
        { id: 425, question: "In Prometheus observability, what is a Histogram metric used for?", options: ["Sampling observations into configurable buckets for percentile latency calculation", "Counting total HTTP requests", "Tracking instant CPU usage", "Storing log messages"], correctIndex: 0, explanation: "Histograms count events into buckets to calculate percentiles (p95, p99) accurately." }
      ],
      3: [
        { id: 431, question: "What is the difference between Blue-Green Deployment and Canary Deployment in Kubernetes?", options: ["Blue-Green switches 100% traffic between two identical environments; Canary routes a small % of traffic (e.g. 5%) to the new version first", "Canary is only for databases", "Blue-Green does not support rollbacks", "They are identical"], correctIndex: 0, explanation: "Canary releases allow verifying real-user metrics with minimal blast radius." },
        { id: 432, question: "How does Kubernetes Horizontal Pod Autoscaler (HPA) make scaling decisions?", options: ["Queries metrics-server periodically and computes desired replicas based on target CPU/memory or custom Prometheus metrics", "Restarts nodes at midnight", "Scales only on manual commands", "Monitors disk read bytes only"], correctIndex: 0, explanation: "HPA calculates desired replicas using the ratio of current metric value to target metric value." },
        { id: 433, question: "What is the purpose of a Kubernetes Ingress Controller (e.g. NGINX Ingress, Traefik)?", options: ["Manages external HTTP/HTTPS routing, SSL termination, and path-based routing into cluster Services", "Creates worker nodes", "Stores secrets on disk", "Backs up PostgreSQL"], correctIndex: 0, explanation: "Ingress provides L7 routing rules mapping hostnames and URL paths to backend ClusterIP services." },
        { id: 434, question: "In GitOps (ArgoCD / Flux), what is the single source of truth for cluster state?", options: ["A Git repository containing declarative Kubernetes manifests", "The Kubernetes etcd database", "Docker hub images", "Developer local machine"], correctIndex: 0, explanation: "GitOps continuously reconciles live cluster state to match the declarative manifests in Git." },
        { id: 435, question: "What is the difference between an Overlay Network (e.g. Calico, Flannel) and host-level networking in K8s?", options: ["Overlay encapsulates packets across node boundaries allowing pods on different hosts to communicate via virtual subnets", "Overlay requires public IPs for all pods", "Host networking is more isolated", "Overlay disables TCP"], correctIndex: 0, explanation: "CNI plugins like Calico implement encapsulation or BGP routing for pod-to-pod communication." }
      ]
    },
    dsa: {
      1: [
        { id: 511, question: "What is the time complexity to access an element by index in an Array?", options: ["O(1) constant time", "O(N) linear time", "O(log N)", "O(N^2)"], correctIndex: 0, explanation: "Arrays have contiguous memory layout allowing instant address calculation: base + (index * size)." },
        { id: 512, question: "What is the time complexity of searching in a sorted array of N elements using Binary Search?", options: ["O(log N)", "O(1)", "O(N)", "O(N log N)"], correctIndex: 0, explanation: "Binary search halves search space on each comparison, running in logarithmic time." },
        { id: 513, question: "Which data structure follows the LIFO (Last In First Out) principle?", options: ["Stack", "Queue", "LinkedList", "Binary Tree"], correctIndex: 0, explanation: "Stacks push and pop elements from the top in LIFO order." },
        { id: 514, question: "Which data structure follows the FIFO (First In First Out) principle?", options: ["Queue", "Stack", "HashMap", "Max Heap"], correctIndex: 0, explanation: "Queues enqueue at the rear and dequeue from the front in FIFO order." },
        { id: 515, question: "What is the worst-case time complexity of Quick Sort?", options: ["O(N^2)", "O(N log N)", "O(N)", "O(log N)"], correctIndex: 0, explanation: "When the chosen pivot is always the smallest or largest element on already sorted data." }
      ],
      2: [
        { id: 521, question: "What is the amortized time complexity of inserting into a Dynamic Array (ArrayList / std::vector)?", options: ["O(1) amortized", "O(N) always", "O(log N)", "O(N^2)"], correctIndex: 0, explanation: "Geometric doubling of capacity ensures O(1) amortized time per insertion." },
        { id: 522, question: "Which algorithm detects negative weight cycles in a directed graph?", options: ["Bellman-Ford Algorithm", "Dijkstra's Algorithm", "Kruskal's Algorithm", "Prim's Algorithm"], correctIndex: 0, explanation: "Bellman-Ford relaxes all edges V-1 times; an additional relaxation indicates a negative cycle." },
        { id: 523, question: "What is the time complexity to build a Binary Heap from an unordered array of N elements?", options: ["O(N)", "O(N log N)", "O(log N)", "O(N^2)"], correctIndex: 0, explanation: "Bottom-up heapify runs in strict O(N) linear time due to decaying geometric series of tree heights." },
        { id: 524, question: "Which data structure is optimal for Range Minimum Queries (RMQ) with point updates in O(log N)?", options: ["Segment Tree / Fenwick Tree", "LinkedList", "Binary Search Tree", "Stack"], correctIndex: 0, explanation: "Segment Trees answer range queries and update elements in O(log N) time." },
        { id: 525, question: "What is the space complexity of Kahn's Algorithm for Topological Sort on a graph G(V, E)?", options: ["O(V + E)", "O(1)", "O(V^2)", "O(E log V)"], correctIndex: 0, explanation: "Requires an in-degree array of size V and adjacency representation of size V+E." }
      ],
      3: [
        { id: 531, question: "What is the time complexity of finding Strongly Connected Components using Tarjan's or Kosaraju's Algorithm?", options: ["O(V + E)", "O(V * E)", "O(V^2)", "O(E log V)"], correctIndex: 0, explanation: "Tarjan's algorithm uses DFS traversal with low-link values in linear O(V + E) time." },
        { id: 532, question: "In String matching, what does the KMP (Knuth-Morris-Pratt) algorithm preprocess to achieve O(N + M) time?", options: ["The Longest Proper Prefix which is also Suffix (LPS) array", "Suffix Tree", "Trie nodes", "Hash table"], correctIndex: 0, explanation: "The LPS array avoids re-checking matched characters upon pattern mismatch." },
        { id: 533, question: "What is the time complexity of Dijkstra's Algorithm implemented with a Min-Heap / PriorityQueue?", options: ["O((V + E) log V)", "O(V^2)", "O(E * V)", "O(V log E)"], correctIndex: 0, explanation: "Extract-min takes log V for each vertex and edge relaxation pushes up to E edges into heap." },
        { id: 534, question: "What is the state transition for the 0/1 Knapsack problem with item weights W and values V?", options: ["dp[i][w] = max(dp[i-1][w], V[i-1] + dp[i-1][w - W[i-1]])", "dp[i] = dp[i-1] + W[i]", "dp[w] = dp[w] * 2", "dp[i][w] = min(dp[i-1][w], V[i])"], correctIndex: 0, explanation: "Either exclude item i or include it and take remainder capacity w - W[i-1]." },
        { id: 535, question: "What is the time complexity to search, insert, and delete a word of length L in a Trie?", options: ["O(L)", "O(N * L)", "O(log N)", "O(1)"], correctIndex: 0, explanation: "Trie operations depend strictly on the length of the string L, independent of total words stored." }
      ]
    }
  };

  const getDomainLevelFallback = (domain, level) => {
    const domainSet = DOMAIN_LEVEL_QUESTIONS[domain] || DOMAIN_LEVEL_QUESTIONS.aiml;
    return domainSet[level] || domainSet[1] || DOMAIN_LEVEL_QUESTIONS.aiml[1];
  };

  const [quizQuestions, setQuizQuestions] = React.useState(getDomainLevelFallback('aiml', 1));
  const [quizAnswers, setQuizAnswers] = React.useState({});
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [assessmentResult, setAssessmentResult] = React.useState(null);

  const DOMAINS = [
    { id: 'aiml', name: 'AI / Machine Learning & PyTorch', icon: '🤖', sections: 'Statistics, Scikit-Learn, Deep Learning, Transformers, RAG', totalQ: '70+' },
    { id: 'java', name: 'Java Core & Spring Boot', icon: '☕', sections: 'OOP, Collections, Concurrency, Spring Data, REST, Kafka', totalQ: '80+' },
    { id: 'db', name: 'Database & SQL Optimization', icon: '🗄️', sections: 'SQL Joins, Normalization, ACID, Indexing, Concurrency', totalQ: '75+' },
    { id: 'sysdesign', name: 'System Design & Distributed Systems', icon: '🏗️', sections: 'Scalability, Caching, Load Balancing, Rate Limiting, Outbox', totalQ: '60+' },
    { id: 'devops', name: 'DevOps & Cloud SRE', icon: '🚢', sections: 'Linux, Docker, CI/CD, Kubernetes, AWS, Prometheus', totalQ: '65+' },
    { id: 'dsa', name: 'Data Structures & Algorithms', icon: '🧠', sections: 'Arrays, Strings, Linked Lists, Trees, Graphs, DP', totalQ: '100+' }
  ];

  const LEVELS = [
    { num: 1, name: 'Foundations', desc: 'Definitions, basic concepts, simple code tracing', passScore: 75 },
    { num: 2, name: 'Core Application', desc: 'Code analysis, algorithm selection, complexity analysis', passScore: 75 },
    { num: 3, name: 'Advanced Reasoning', desc: 'Tradeoffs, edge cases, multi-step optimization', passScore: 80 },
    { num: 4, name: 'Interview Scenarios', desc: 'Product company interview questions, production failure modes', passScore: 80 },
    { num: 5, name: 'Expert Mastery', desc: 'Hard multi-concept architecture, low-level internals', passScore: 85 }
  ];

  const currentDomainObj = DOMAINS.find(d => d.id === activeDomain) || DOMAINS[0];
  const maxUnlockedLevel = unlockedLevels[activeDomain] || 1;

  // Load Questions for Domain & Level
  const handleLoadAssessment = async (domain = activeDomain, level = selectedLevel) => {
    setIsGenerating(true);
    setAssessmentResult(null);
    setQuizAnswers({});

    const fallbackSet = getDomainLevelFallback(domain, level);
    setQuizQuestions(fallbackSet);

    try {
      const topicName = DOMAINS.find(d => d.id === domain)?.name || 'AI / Machine Learning & PyTorch';
      const res = await fetch(`${API_BASE}/api/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicName,
          level: level,
          userEmail: user ? user.email : 'learner@example.com'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuizQuestions(data.questions);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit Assessment
  const handleSubmitAssessment = async () => {
    if (Object.keys(quizAnswers).length < quizQuestions.length) {
      alert("Please answer all questions before submitting your assessment.");
      return;
    }

    setIsSubmitting(true);
    try {
      let correctCount = 0;
      quizQuestions.forEach(q => {
        if (quizAnswers[q.id] === q.correctIndex) correctCount++;
      });

      const res = await fetch(`${API_BASE}/api/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user ? user.email : 'learner@example.com',
          topic: currentDomainObj.name,
          totalQuestions: quizQuestions.length,
          correctAnswers: correctCount,
          level: selectedLevel
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAssessmentResult(data);

        if (data.passed && data.nextLevelUnlocked > maxUnlockedLevel) {
          setUnlockedLevels(prev => ({
            ...prev,
            [activeDomain]: data.nextLevelUnlocked
          }));
          try { confetti({ particleCount: 70, spread: 60 }); } catch (e) {}
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDomainChange = (domainId) => {
    setActiveDomain(domainId);
    setSelectedLevel(1);
    handleLoadAssessment(domainId, 1);
  };

  React.useEffect(() => {
    handleLoadAssessment(activeDomain, selectedLevel);
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '24px', alignItems: 'start' }}>
      
      {/* LEFT: DOMAINS, LEVELS & QUESTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* HEADER */}
        <div>
          <span className="badge badge-primary">SKILL ASSESSMENT ENGINE</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '4px' }}>
            5-Level Skill Mastery Assessments
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.86rem', marginTop: '2px' }}>
            Structured 5-level curriculum. Pass each level to unlock advanced tiers and generate verified Skill Evidence.
          </p>
        </div>

        {/* DOMAIN SELECTION CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {DOMAINS.map(d => {
            const isSel = activeDomain === d.id;
            return (
              <div
                key={d.id}
                onClick={() => handleDomainChange(d.id)}
                className="saas-card"
                style={{
                  padding: '14px',
                  cursor: 'pointer',
                  background: isSel ? '#eef2ff' : '#ffffff',
                  borderColor: isSel ? '#4f46e5' : '#e2e8f0',
                  boxShadow: isSel ? '0 2px 8px rgba(79, 70, 229, 0.15)' : 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem' }}>{d.icon}</span>
                  <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                    Active
                  </span>
                </div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: isSel ? '#4f46e5' : '#0f172a', marginTop: '6px', lineHeight: 1.3 }}>
                  {d.name}
                </h4>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px' }}>
                  {d.totalQ} Questions · 5 Levels
                </div>
              </div>
            );
          })}
        </div>

        {/* 5 PROGRESSIVE LEVELS STRIP */}
        <div className="saas-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>
            Select Level for {currentDomainObj.name}:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {LEVELS.map(l => {
              const isSelected = selectedLevel === l.num;

              return (
                <button
                  key={l.num}
                  onClick={() => {
                    setSelectedLevel(l.num);
                    handleLoadAssessment(activeDomain, l.num);
                  }}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '8px',
                    border: '1px solid',
                    background: isSelected ? '#4f46e5' : '#ffffff',
                    borderColor: isSelected ? '#4f46e5' : '#e2e8f0',
                    color: isSelected ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>Level {l.num}</span>
                  <span style={{ fontSize: '0.65rem', opacity: isSelected ? 0.9 : 0.7 }}>{l.name}</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#475569' }}>
              🎯 Current Focus: <strong style={{ color: '#0f172a' }}>{LEVELS[selectedLevel - 1]?.name}</strong> — {LEVELS[selectedLevel - 1]?.desc}
            </span>
            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
              Pass Threshold: {LEVELS[selectedLevel - 1]?.passScore}%
            </span>
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isGenerating ? (
            <div className="saas-card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚡</div>
              <div style={{ fontWeight: 700 }}>Loading Level {selectedLevel} Questions...</div>
            </div>
          ) : (
            quizQuestions.map((q, qIdx) => (
              <div key={q.id || qIdx} className="saas-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                    Question {qIdx + 1} of {quizQuestions.length}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>1 Point</span>
                </div>

                <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.45, marginBottom: '14px' }}>
                  {q.question}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt, oIdx) => {
                    const isSelected = quizAnswers[q.id] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid',
                          background: isSelected ? '#eef2ff' : '#ffffff',
                          borderColor: isSelected ? '#4f46e5' : '#e2e8f0',
                          color: isSelected ? '#4f46e5' : '#334155',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: isSelected ? '#4f46e5' : '#64748b'
                        }}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* SUBMIT BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button
              onClick={handleSubmitAssessment}
              disabled={isSubmitting || isGenerating}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.88rem' }}
            >
              {isSubmitting ? 'Evaluating Score...' : 'Submit Assessment →'}
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT: SCORECARD & PERFORMANCE FEEDBACK */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {assessmentResult ? (
          <div className="saas-card" style={{ padding: '24px', borderLeft: `4px solid ${assessmentResult.passed ? '#10b981' : '#ef4444'}` }}>
            <span className={assessmentResult.passed ? 'badge badge-success' : 'badge badge-danger'}>
              {assessmentResult.passed ? 'ASSESSMENT PASSED' : 'NEEDS PRACTICE'}
            </span>

            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: assessmentResult.passed ? '#059669' : '#dc2626', marginTop: '8px' }}>
              {Math.round(assessmentResult.scorePercentage)}%
            </div>

            <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
              {assessmentResult.correctAnswers} of {assessmentResult.totalQuestions} questions answered correctly.
            </div>

            <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#334155' }}>
              {assessmentResult.message}
            </div>

            <button
              onClick={() => handleLoadAssessment(activeDomain, selectedLevel)}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px', fontSize: '0.82rem', padding: '8px' }}
            >
              Retake Assessment 🔄
            </button>
          </div>
        ) : (
          <div className="saas-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Assessment Rubric
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45, marginBottom: '14px' }}>
              Complete the quiz to calculate your real-time skill mastery rating. Scoring ≥ 75% unlocks the next progressive tier.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem', color: '#475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>Level 1 — Foundations</span>
                <strong style={{ color: '#0f172a' }}>75% required</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>Level 2 — Application</span>
                <strong style={{ color: '#0f172a' }}>75% required</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>Level 3 — Reasoning</span>
                <strong style={{ color: '#0f172a' }}>80% required</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>Level 4 — Interview</span>
                <strong style={{ color: '#0f172a' }}>80% required</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span>Level 5 — Mastery</span>
                <strong style={{ color: '#0f172a' }}>85% required</strong>
              </div>
            </div>
          </div>
        )}

        {/* QUICK PRACTICE SHORTCUT */}
        <div className="saas-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            📚 Need Topic Practice?
          </h4>
          <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, marginBottom: '12px' }}>
            Jump into our curated 450+ problem DSA tracker or build portfolio applications to sharpen your skills.
          </p>
          <button
            onClick={() => setActiveTab('dsa')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '7px' }}
          >
            Open 450+ DSA Sheet →
          </button>
        </div>

      </div>

    </div>
  );
}

window.QuizView = QuizView;
