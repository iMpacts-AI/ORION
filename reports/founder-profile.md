# Founder & Builder Profile: Saqib

**Founder:** Saqib  
**Age:** 13  
**Initiative:** iMpact ([https://impacts-ai.com](https://impacts-ai.com))  
**Primary Project:** ORION (Autonomous Permission-Based Desktop AI Agent)  
**Location:** United Arab Emirates  
**Operating Principle:** *"Ideas are ideas. Implementation is the real deal."*  

---

## 1. Who I Am

I am a 13-year-old independent software builder developing technology systems. I spend my time designing architectures, writing TypeScript and Python, diagnosing operating system internals, reading technical documentation, and building functional software.

I founded **iMpact** as an early-stage technology initiative with a singular mission: to build useful, human-centered software and practical intelligent systems that respect human authority and solve real-world problems.

---

## 2. Why Age is Context, Not a Credential

In technology circles, youth is often treated as a marketing novelty or an excuse for incomplete work. I reject both:

* **Age is not an excuse for sloppy code:** A bug in a Win32 input driver or an unhandled promise rejection in an IPC channel causes the exact same system crash regardless of whether the programmer is 13 or 35.
* **Age is not a substitute for evidence:** Having an ambitious idea is trivial; writing 40 passing automated test suites, configuring multi-provider circuit breakers, and enforcing process tree termination is what demonstrates capability.

My age is simply contextual data showing where I am starting. I want my work to be judged strictly by the quality of its architecture, the honesty of its documentation, and the reliability of its implementation.

---

## 3. The Builder's Journey: From Ideas to Systems Engineering

### Phase 1: The Frustration with Web Chatbots
Like many developers, I started by experimenting with cloud AI APIs. However, I quickly became frustrated with the limitations of browser-based chatbots. A chatbot in a tab cannot see what is happening on your screen, cannot inspect your local source code, cannot run your test suite, and cannot automate your desktop tasks.

### Phase 2: Building the Desktop Foundation (ORION)
I realized that if AI is going to become a genuine operating partner, it must live on the desktop. I chose Electron with TypeScript to bridge the web ecosystem with native Windows OS APIs. 

Building ORION forced me to confront real engineering problems:
* How do you prevent untrusted UI code from accessing sensitive cloud API keys? *(Solution: Quarantining all credentials in the Node.js Main process with context isolation).*
* How do you prevent an autonomous agent from freezing the UI during multi-step tasks? *(Solution: Directed Acyclic Graph dependency resolution and asynchronous event streaming).*
* How do you ensure safety when an AI model has permission to move the mouse and type keys? *(Solution: Action risk scoring, path blacklists for `C:\Windows`, and process-tree Emergency Stop).*

### Phase 3: Forensic Audits & Hardening
In early prototypes, like many junior developers, I used in-memory mocks and optimistic assumptions. During our forensic architecture audit, I made the disciplined decision to eliminate all simulated stubs:
* Replaced in-memory Maps with atomic disk JSON persistence (`.orion_memory/`).
* Replaced dummy browser mocks with an HTTP fetch and DOM link extraction engine.
* Replaced global test runs with pure process isolation (`run_suites.cjs`), bringing all 40 test suites to 100% green.
* Transparently relabeled the offline heuristic provider as an explicit rule-based router rather than pretending it was a local neural network.

---

## 4. Hardware Lab & Local AI Focus

Recognizing that cloud API costs and latency are unsustainable for continuous desktop vision loops, I worked to design and acquire a dedicated local AI engineering workstation:

* **Workstation:** Dell Precision Mobile Workstation (`PRECISION-ULTRA-RTX`)
* **Compute:** 12th Gen Intel Core i7-12850HX (16 Cores, 24 Threads)
* **Memory:** 128 GB High-Speed DDR5 RAM
* **Graphics:** NVIDIA RTX A5500 Laptop GPU (16 GB Dedicated GDDR6 VRAM)
* **Storage:** 1 TB PCIe 4.0 NVMe SSD

This hardware allows me to load and benchmark 8B to 32B open-weight models (such as Llama 3.1, Qwen 2.5, and DeepSeek R1) entirely on-device, establishing the foundation for ORION's transition to 100% private, zero-cost local intelligence.

---

## 5. Core Lessons Learned

1. **Implementation is the Real Deal**: An architecture diagram without working source code is just digital art. Real learning only occurs when code hits compiler errors, network timeouts, and operating system edge cases.
2. **Safety Must Be Architectural**: You cannot prompt an LLM to "be safe" and trust it. Safety requires deterministic code gates: path blacklists, permission checks, and hard OS kill signals.
3. **Resilience Requires Paranoia**: Cloud APIs will fail, rate limit, and change formats. Systems must be designed with automatic fallback tiers so they degrade gracefully rather than crashing.
4. **Honesty Builds Credibility**: Senior engineers respect developers who clearly state what is unfinished far more than those who exaggerate what is done.

---

## 6. Mentorship & Long-Term Goals

### What I Am Seeking:
I am actively seeking technical mentorship from experienced senior software architects, AI systems engineers, and founders. 

I am looking for mentors who will:
* Review my code and tear apart my architecture.
* Challenge my assumptions about system design and agent grounding.
* Guide me toward foundational computer science topics (operating system internals, compilers, distributed consensus, memory management).
* Hold me to professional, world-class engineering standards.

### The Long-Term Ambition:
My ambition is to build **iMpact** into an internationally recognized technology company that develops transformative, reliable, and human-centered software. 

I am committed to putting in the thousands of hours of implementation, debugging, and continuous learning required to achieve that goal.
