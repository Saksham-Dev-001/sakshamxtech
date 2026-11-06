import { CLesson } from '../types';

/**
 * SakshamXTech C Programming Academy - Complete 30-Day Systems Curriculum
 * Authored by Saksham Sharma (@sakshamxtech)
 * Fully populated with practical runnable C code, expected outputs,
 * exercises with solutions, and interactive quizzes.
 */
export const initialCLessons: CLesson[] = [
  {
    "id": "c-1",
    "dayNumber": 1,
    "title": "Introduction to C & GCC Compilation Pipeline",
    "slug": "day-1-introduction-to-c",
    "summary": "Discover why C powers modern kernels and operating systems. Understand the 4 phases: Preprocessing, Compiling, Assembly, and Linking.",
    "durationMinutes": 32,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 1: Welcome to the C Programming Academy!\n\nHosted by Saksham Sharma on the SakshamXTech YouTube channel. C is known as the \"Mother of Modern Programming Languages\". Despite being developed in 1972 by Dennis Ritchie at Bell Labs, C continues to run the most critical infrastructure in the world today:\n- The Linux Kernel & Windows NT Kernel\n- High-performance databases (PostgreSQL, SQLite, Redis)\n- Web browser rendering engines (Google Chrome V8 & Blink)\n- Aerospace embedded firmware & automotive ECUs\n\n---\n\n## The 4 Stages of GCC Compilation\n\nWhen you type `gcc -Wall -O2 main.c -o program` in your terminal, the compiler executes four distinct internal phases:\n\n```\n  [ Source Code: main.c ]\n            │\n            ▼  1. Preprocessor (cpp) — Expands #include, #define macros, strips comments\n  [ Translation Unit: main.i ]\n            │\n            ▼  2. Compiler (gcc/cc1) — Synthesizes C code into CPU Architecture Assembly\n  [ Assembly Code: main.s ]\n            │\n            ▼  3. Assembler (as) — Translates Assembly mnemonics into Machine Object Code\n  [ Object File: main.o ]\n            │\n            ▼  4. Linker (ld) — Combines Object files with C Runtime (crt0.o) & libc.so\n  [ Final Executable: ./program ]\n```\n\n### Key Flags to Remember\n- `-E`: Stops after preprocessing (outputs `.i` text).\n- `-S`: Stops after compilation into assembly (outputs `.s` file).\n- `-c`: Compiles into machine object file without linking (outputs `.o` file).\n- `-Wall -Wextra`: Enables all compiler warnings (essential for writing bug-free C).",
    "codeSnippet": "#include <stdio.h>\n\nint main(void) {\n    printf(\"========================================\\n\");\n    printf(\"  SakshamXTech C Programming Academy   \\n\");\n    printf(\"  Day 1: GCC Pipeline & Execution Flow \\n\");\n    printf(\"========================================\\n\");\n    printf(\"Status: Environment Initialized Successfully!\\n\");\n    return 0;\n}",
    "expectedOutput": "========================================\n  SakshamXTech C Programming Academy   \n  Day 1: GCC Pipeline & Execution Flow \n========================================\nStatus: Environment Initialized Successfully!",
    "practiceQuestions": [
      {
        "question": "Write a C program that prints your name, target role (e.g. Systems Engineer), and favorite technology stack on separate lines.",
        "hint": "Use newline character \\n inside printf to print across multiple lines.",
        "solutionCode": "#include <stdio.h>\n\nint main(void) {\n    printf(\"Name: Alex Hunter\\n\");\n    printf(\"Target Role: Systems Software Engineer\\n\");\n    printf(\"Favorite Tech: C / Linux Kernel / Google Cloud\\n\");\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "Which stage of the GCC compilation pipeline expands header files (#include) and evaluates macros (#define)?",
        "options": [
          "Assembler",
          "Linker",
          "Preprocessor",
          "Optimizer"
        ],
        "correctIndex": 2,
        "explanation": "The Preprocessor (cpp) handles all directives starting with a hash symbol (#) before the code is handed to the compiler."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-2",
    "dayNumber": 2,
    "title": "Variables, RAM Allocation & Address-of Operator (&)",
    "slug": "day-2-variables-and-memory",
    "summary": "Understand how variables reserve bytes in physical RAM, how the CPU reads them, and how to inspect hexadecimal addresses using & and %p.",
    "durationMinutes": 30,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 2: Variables & Memory Layout\n\nIn C, a variable is not an abstract concept; it represents a fixed sequence of bytes located at a physical hexadecimal address inside the computer RAM.\n\n---\n\n## Memory Breakdown: What Happens on Variable Declaration?\n\n```\n   Memory Address (Hex)      Variable Name    Stored Value\n   ───────────────────────────────────────────────────────\n   0x7ffd5e2a4b8c           int count = 42    00000000 00000000 00000000 00101010 (4 bytes)\n   0x7ffd5e2a4b8b           char grade = 'A'  01000001 (1 byte, ASCII 65)\n```\n\n### The Address-of Operator (`&`)\nThe ampersand (`&`) reveals the memory address of any lvalue in memory. In `printf`, always cast the address to `(void*)` when using the `%p` format specifier to adhere strictly to the C99 standard.",
    "codeSnippet": "#include <stdio.h>\n\nint main(void) {\n    int score = 98;\n    char rank = 'S';\n    double accuracy = 99.45;\n\n    printf(\"Variable [score]:    Value = %d, Size = %zu bytes, Address = %p\\n\", \n           score, sizeof(score), (void*)&score);\n    printf(\"Variable [rank]:     Value = %c, Size = %zu bytes, Address = %p\\n\", \n           rank, sizeof(rank), (void*)&rank);\n    printf(\"Variable [accuracy]: Value = %.2f, Size = %zu bytes, Address = %p\\n\", \n           accuracy, sizeof(accuracy), (void*)&accuracy);\n\n    return 0;\n}",
    "expectedOutput": "Variable [score]:    Value = 98, Size = 4 bytes, Address = 0x7ffd...\nVariable [rank]:     Value = S, Size = 1 bytes, Address = 0x7ffd...\nVariable [accuracy]: Value = 99.45, Size = 8 bytes, Address = 0x7ffd...",
    "practiceQuestions": [
      {
        "question": "Declare two integer variables a and b. Print their memory addresses and determine the byte distance between them on the stack.",
        "hint": "Subtract their addresses or cast them to uintptr_t to inspect the stack direction.",
        "solutionCode": "#include <stdio.h>\n\nint main(void) {\n    int a = 10;\n    int b = 20;\n    printf(\"Address of a: %p\\n\", (void*)&a);\n    printf(\"Address of b: %p\\n\", (void*)&b);\n    printf(\"Byte distance: %ld bytes\\n\", (char*)&a - (char*)&b);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What format specifier must be used in printf to safely display a variable memory address?",
        "options": [
          "%d",
          "%x",
          "%p",
          "%u"
        ],
        "correctIndex": 2,
        "explanation": "%p expects a pointer to void (void*) and prints the platform-dependent hexadecimal address."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-3",
    "dayNumber": 3,
    "title": "Data Types, Format Specifiers & Bit Limits",
    "slug": "day-3-data-types",
    "summary": "Signed vs unsigned numbers, integer overflow behavior, floating-point precision limits, and ASCII character encoding.",
    "durationMinutes": 28,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 3: Data Types, Format Specifiers & Bit Limits\n\nData types in C define the binary interpretation and storage footprint of memory chunks.\n\n---\n\n## Fundamental Types & Sizes (x86_64 Linux / Windows)\n| Type | Typical Size | Range / Description | Format Specifier |\n|---|---|---|---|\n| `char` | 1 byte (8 bits) | -128 to 127 (or ASCII 0-255) | `%c` / `%d` |\n| `short` | 2 bytes (16 bits) | -32,768 to 32,767 | `%hd` |\n| `int` | 4 bytes (32 bits) | -2,147,483,648 to 2,147,483,647 | `%d` |\n| `unsigned int`| 4 bytes (32 bits) | 0 to 4,294,967,295 | `%u` |\n| `long long` | 8 bytes (64 bits) | ±9.22 × 10^18 | `%lld` |\n| `float` | 4 bytes (32 bits) | ~7 decimal digits precision | `%f` |\n| `double` | 8 bytes (64 bits) | ~15 decimal digits precision | `%lf` |\n\n### Integer Overflow & Two's Complement\nSigned integer overflow is **Undefined Behavior (UB)** in C. Unsigned integers wrap around cleanly modulo 2^N.",
    "codeSnippet": "#include <stdio.h>\n#include <limits.h>\n#include <float.h>\n\nint main(void) {\n    printf(\"--- Integer Limits ---\\n\");\n    printf(\"Signed INT Min:   %d\\n\", INT_MIN);\n    printf(\"Signed INT Max:   %d\\n\", INT_MAX);\n    printf(\"Unsigned INT Max: %u\\n\", UINT_MAX);\n    printf(\"CHAR Bits:        %d\\n\", CHAR_BIT);\n\n    unsigned int counter = UINT_MAX;\n    printf(\"\\nUnsigned Overflow Wrap: %u + 1 = %u\\n\", counter, counter + 1);\n\n    return 0;\n}",
    "expectedOutput": "--- Integer Limits ---\nSigned INT Min:   -2147483648\nSigned INT Max:   2147483647\nUnsigned INT Max: 4294967295\nCHAR Bits:        8\n\nUnsigned Overflow Wrap: 4294967295 + 1 = 0",
    "practiceQuestions": [
      {
        "question": "Write a program to demonstrate the difference between signed char and unsigned char when storing 250.",
        "hint": "Signed char max value is 127; assigning 250 will wrap into negative numbers in two's complement.",
        "solutionCode": "#include <stdio.h>\n\nint main(void) {\n    signed char sc = 250;\n    unsigned char uc = 250;\n    printf(\"Signed char value:   %d\\n\", sc);\n    printf(\"Unsigned char value: %u\\n\", uc);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What happens in standard C when an unsigned 32-bit integer exceeds UINT_MAX by 1?",
        "options": [
          "Program crashes with SIGFPE",
          "It rolls over to 0 modulo 2^32",
          "Undefined behavior occurs",
          "It clamps to UINT_MAX"
        ],
        "correctIndex": 1,
        "explanation": "According to the ISO C standard, arithmetic on unsigned types never overflows; it computes modulo 2^N."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-4",
    "dayNumber": 4,
    "title": "Arithmetic, Logical & Bitwise Operators",
    "slug": "day-4-operators-and-bitwise-logic",
    "summary": "Master bitwise shifts, masks, logical short-circuit evaluation, and high-performance bit twiddling hacks.",
    "durationMinutes": 35,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 4: Arithmetic, Logical & Bitwise Operators\n\nIn systems programming, bitwise operations are paramount for interacting with hardware registers, compression algorithms, and cryptographic primitives.\n\n---\n\n## The 6 Bitwise Operators\n- `&` (Bitwise AND): Both bits must be 1.\n- `|` (Bitwise OR): Either bit is 1.\n- `^` (Bitwise XOR): Bits must be different.\n- `~` (Bitwise NOT): Inverts every bit (1s complement).\n- `<<` (Left Shift): Multiplies by 2^N.\n- `>>` (Right Shift): Divides by 2^N.\n\n### Short-Circuit Evaluation\nIn logical expressions (`&&` and `||`), if the left operand determines the outcome, the right operand is **never evaluated**:\n```c\nif (ptr != NULL && *ptr == 10) { ... } // Safe: will never dereference NULL!\n```",
    "codeSnippet": "#include <stdio.h>\n\nint main(void) {\n    int x = 12; // Binary: 00001100\n    int y = 25; // Binary: 00011001\n\n    printf(\"x & y = %d (00001000)\\n\", x & y); // 8\n    printf(\"x | y = %d (00011101)\\n\", x | y); // 29\n    printf(\"x ^ y = %d (00010101)\\n\", x ^ y); // 21\n    printf(\"x << 2 = %d (Multiply by 4)\\n\", x << 2); // 48\n    printf(\"y >> 1 = %d (Divide by 2)\\n\", y >> 1); // 12\n\n    // Check if number is power of 2 using bit-twiddling: n & (n - 1) == 0\n    int n = 16;\n    int isPowerOfTwo = (n > 0) && ((n & (n - 1)) == 0);\n    printf(\"Is %d a power of 2? %s\\n\", n, isPowerOfTwo ? \"YES\" : \"NO\");\n\n    return 0;\n}",
    "expectedOutput": "x & y = 8 (00001000)\nx | y = 29 (00011101)\nx ^ y = 21 (00010101)\nx << 2 = 48 (Multiply by 4)\ny >> 1 = 12 (Divide by 2)\nIs 16 a power of 2? YES",
    "practiceQuestions": [
      {
        "question": "Write a C snippet to swap two integers without using any temporary variable using the XOR swap algorithm.",
        "hint": "Use a = a ^ b; b = a ^ b; a = a ^ b;",
        "solutionCode": "#include <stdio.h>\n\nint main(void) {\n    int a = 15, b = 42;\n    printf(\"Before swap: a = %d, b = %d\\n\", a, b);\n    a = a ^ b;\n    b = a ^ b;\n    a = a ^ b;\n    printf(\"After swap:  a = %d, b = %d\\n\", a, b);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What is the fastest way in C to multiply an integer x by 8 using bit manipulation?",
        "options": [
          "x * 8",
          "x << 3",
          "x >> 3",
          "x ^ 8"
        ],
        "correctIndex": 1,
        "explanation": "Shifting left by 3 bits (x << 3) shifts the binary digits by 3 positions, multiplying the value by 2^3 = 8."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-5",
    "dayNumber": 5,
    "title": "Conditional Branching: if, else-if, switch & Jump Tables",
    "slug": "day-5-conditionals-and-branching",
    "summary": "Branch prediction, compiler jump tables in switch-case, and ternary conditional expressions.",
    "durationMinutes": 30,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 5: Conditional Branching & Jump Tables\n\nEvery software algorithm makes decisions based on conditions. At the CPU level, branching translates into conditional jumps (`je`, `jne`, `jle`).\n\n---\n\n## `if-else` vs `switch-case`\n- **`if-else` chain**: Evaluated sequentially from top to bottom (O(N) time).\n- **`switch-case`**: When cases are dense integers, the GCC compiler builds a **Jump Table (O(1) dispatch)** in memory, jumping directly to the target label without sequential checks!\n\n### Switch Fallthrough\nAlways terminate cases with `break` unless deliberate fallthrough is desired. In modern C (C23), you can mark intentional fallthrough with `[[fallthrough]];`.",
    "codeSnippet": "#include <stdio.h>\n\nint main(void) {\n    int statusCode = 200;\n\n    printf(\"HTTP Status Inspection:\\n\");\n    switch (statusCode) {\n        case 200:\n            printf(\"-> 200 OK: Request succeeded.\\n\");\n            break;\n        case 301:\n            printf(\"-> 301 Moved Permanently.\\n\");\n            break;\n        case 404:\n            printf(\"-> 404 Not Found: Resource does not exist.\\n\");\n            break;\n        case 500:\n            printf(\"-> 500 Internal Server Error.\\n\");\n            break;\n        default:\n            printf(\"-> Unknown HTTP Status Code.\\n\");\n            break;\n    }\n\n    // Ternary Operator\n    int score = 85;\n    const char *status = (score >= 50) ? \"PASS\" : \"FAIL\";\n    printf(\"Student Result: %s (Score: %d)\\n\", status, score);\n\n    return 0;\n}",
    "expectedOutput": "HTTP Status Inspection:\n-> 200 OK: Request succeeded.\nStudent Result: PASS (Score: 85)",
    "practiceQuestions": [
      {
        "question": "Write a program that takes a character grade (A, B, C, D, F) and prints the corresponding GPA score using switch-case.",
        "hint": "Use case 'A': ... case 'B': ... default:",
        "solutionCode": "#include <stdio.h>\n\nint main(void) {\n    char grade = 'A';\n    float gpa;\n    switch (grade) {\n        case 'A': gpa = 4.0f; break;\n        case 'B': gpa = 3.0f; break;\n        case 'C': gpa = 2.0f; break;\n        case 'D': gpa = 1.0f; break;\n        default:  gpa = 0.0f; break;\n    }\n    printf(\"Grade %c = GPA %.1f\\n\", grade, gpa);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "Why does the compiler often optimize a switch-case statement better than an if-else ladder?",
        "options": [
          "Switch statements do not use memory",
          "The compiler can construct an O(1) jump table for consecutive case constants",
          "Switch statements run on the GPU",
          "If-else statements are illegal in ANSI C"
        ],
        "correctIndex": 1,
        "explanation": "Compilers construct an indexed array of code addresses (a jump table), allowing O(1) indirect branching directly to the correct branch."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-6",
    "dayNumber": 6,
    "title": "Loops, Iterations & Nested Control Patterns",
    "slug": "day-6-loops-and-iterations",
    "summary": "Master for, while, do-while loops, loop invariants, break/continue nuances, and nested pyramid algorithms.",
    "durationMinutes": 34,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 6: Loops, Iterations & Control Patterns\n\nRepetition is the core driver of algorithmic computation.\n\n---\n\n## 3 Loop Constructs in C\n1. **`for (init; condition; update)`**: Used when the iteration count is known beforehand.\n2. **`while (condition)`**: Entry-controlled loop. Checks condition before body execution.\n3. **`do { ... } while (condition);`**: Exit-controlled loop. Guarantees the body executes **at least once** regardless of condition.\n\n### Controlling Loop Execution\n- `break`: Exits the innermost loop immediately.\n- `continue`: Skips the remaining statements in the current iteration and jumps to the update step.",
    "codeSnippet": "#include <stdio.h>\n\nint main(void) {\n    printf(\"--- Nested Pattern: Pascal Triangle Preview ---\\n\");\n    int rows = 5;\n\n    for (int i = 1; i <= rows; i++) {\n        // Print leading spaces\n        for (int space = 1; space <= rows - i; space++) {\n            printf(\"  \");\n        }\n        // Print increasing numbers\n        for (int j = 1; j <= i; j++) {\n            printf(\"%d \", j);\n        }\n        // Print decreasing numbers\n        for (int j = i - 1; j >= 1; j--) {\n            printf(\"%d \", j);\n        }\n        printf(\"\\n\");\n    }\n\n    return 0;\n}",
    "expectedOutput": "--- Nested Pattern: Pascal Triangle Preview ---\n        1 \n      1 2 1 \n    1 2 3 2 1 \n  1 2 3 4 3 2 1 \n1 2 3 4 5 4 3 2 1 ",
    "practiceQuestions": [
      {
        "question": "Write a program using a while loop to reverse the digits of an integer (e.g., 12345 becomes 54321).",
        "hint": "Use modulo % 10 to extract the last digit and divide / 10 to strip it.",
        "solutionCode": "#include <stdio.h>\n\nint main(void) {\n    int num = 12345;\n    int reversed = 0;\n    int temp = num;\n    while (temp > 0) {\n        reversed = (reversed * 10) + (temp % 10);\n        temp /= 10;\n    }\n    printf(\"Original: %d, Reversed: %d\\n\", num, reversed);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "Which loop construct guarantees that its body will execute at least once even if the initial condition is false?",
        "options": [
          "for loop",
          "while loop",
          "do-while loop",
          "nested loop"
        ],
        "correctIndex": 2,
        "explanation": "In a do-while loop, the test condition is evaluated at the bottom (exit-controlled), so the body runs once before any check."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-7",
    "dayNumber": 7,
    "title": "Functions, Prototypes & Stack Frames",
    "slug": "day-7-functions-and-stack-frames",
    "summary": "Function prototypes, calling conventions, activation records, call by value vs call by reference.",
    "durationMinutes": 35,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 7: Functions, Prototypes & Stack Frames\n\nFunctions modularize software into reusable, testable compilation units.\n\n---\n\n## Anatomy of a Stack Frame (Call Stack)\nWhen a function is called, the CPU pushes an **Activation Record (Stack Frame)** onto the stack:\n```\n   ┌────────────────────────────────┐\n   │ Caller Saved Registers         │\n   ├────────────────────────────────┤\n   │ Return Address (Instruction Pt)│\n   ├────────────────────────────────┤\n   │ Function Parameters            │\n   ├────────────────────────────────┤\n   │ Local Variables                │\n   └────────────────────────────────┘ <── Stack Pointer (RSP / ESP)\n```\n\n### Call by Value vs Call by Reference\n- In C, **ALL function arguments are strictly passed by value** (a copy is passed).\n- To simulate \"Call by Reference\", we pass the **memory address (pointer)** of the variable!",
    "codeSnippet": "#include <stdio.h>\n\n// Function Declarations (Prototypes)\nvoid swapByValue(int a, int b);\nvoid swapByReference(int *a, int *b);\n\nint main(void) {\n    int x = 10, y = 20;\n\n    printf(\"Original values: x = %d, y = %d\\n\", x, y);\n\n    swapByValue(x, y);\n    printf(\"After swapByValue: x = %d, y = %d (Unchanged!)\\n\", x, y);\n\n    swapByReference(&x, &y);\n    printf(\"After swapByReference: x = %d, y = %d (Swapped!)\\n\", x, y);\n\n    return 0;\n}\n\nvoid swapByValue(int a, int b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}\n\nvoid swapByReference(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}",
    "expectedOutput": "Original values: x = 10, y = 20\nAfter swapByValue: x = 10, y = 20 (Unchanged!)\nAfter swapByReference: x = 20, y = 10 (Swapped!)",
    "practiceQuestions": [
      {
        "question": "Write a function findMaxAndMin(int a, int b, int *max, int *min) that outputs both the maximum and minimum values using pointer parameters.",
        "hint": "Assign *max and *min inside the function body.",
        "solutionCode": "#include <stdio.h>\n\nvoid findMaxAndMin(int a, int b, int *max, int *min) {\n    if (a > b) {\n        *max = a;\n        *min = b;\n    } else {\n        *max = b;\n        *min = a;\n    }\n}\n\nint main(void) {\n    int high, low;\n    findMaxAndMin(45, 120, &high, &low);\n    printf(\"Max: %d, Min: %d\\n\", high, low);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "Why does passing a variable to a function by value fail to alter the caller's original variable?",
        "options": [
          "Because C functions only have read access to memory",
          "Because the parameter in the callee receives a cloned copy in its own stack frame",
          "Because the CPU prohibits writes inside subroutines",
          "Because variables are immutable by default in C"
        ],
        "correctIndex": 1,
        "explanation": "C strictly uses call-by-value. Parameters are initialized with copies of the arguments inside the new stack frame."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-8",
    "dayNumber": 8,
    "title": "Recursion, Base Cases & Stack Overflow Mechanics",
    "slug": "day-8-recursion-and-stack-overflow",
    "summary": "Master recursive decomposition, call-stack mechanics, base cases, and how infinite recursion triggers SIGSEGV stack overflow.",
    "durationMinutes": 32,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 8: Recursion & Stack Overflow Mechanics\n\nRecursion occurs when a function calls itself to solve a smaller instance of the same problem.\n\n---\n\n## The 2 Iron Rules of Recursion\n1. **Base Case**: The termination condition where the recursion stops. Without this, the stack will grow indefinitely until physical stack memory (typically 8MB on Linux) is exhausted, triggering a **Stack Overflow (Segmentation fault `SIGSEGV`)**.\n2. **Recursive Step**: The progression step that strictly moves the arguments closer to the base case.\n\n### Call Stack Visualization (Factorial 3)\n```\n   [ factorial(1) ] -> Returns 1\n   [ factorial(2) ] -> Returns 2 * 1 = 2\n   [ factorial(3) ] -> Returns 3 * 2 = 6\n   [ main()       ] -> Prints 6\n```",
    "codeSnippet": "#include <stdio.h>\n\nlong long factorial(int n) {\n    // Base Case\n    if (n <= 1) {\n        return 1;\n    }\n    // Recursive Step\n    return n * factorial(n - 1);\n}\n\nint fibonacci(int n) {\n    if (n <= 0) return 0;\n    if (n == 1) return 1;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nint main(void) {\n    int n = 7;\n    printf(\"Factorial of %d = %lld\\n\", n, factorial(n));\n    printf(\"Fibonacci sequence up to %d:\\n\", n);\n    for (int i = 0; i <= n; i++) {\n        printf(\"%d \", fibonacci(i));\n    }\n    printf(\"\\n\");\n    return 0;\n}",
    "expectedOutput": "Factorial of 7 = 5040\nFibonacci sequence up to 7:\n0 1 1 2 3 5 8 13 ",
    "practiceQuestions": [
      {
        "question": "Write a recursive function sumOfDigits(int n) that computes the sum of the digits of a given positive integer.",
        "hint": "Base case is n == 0. Recursive step is (n % 10) + sumOfDigits(n / 10).",
        "solutionCode": "#include <stdio.h>\n\nint sumOfDigits(int n) {\n    if (n == 0) return 0;\n    return (n % 10) + sumOfDigits(n / 10);\n}\n\nint main(void) {\n    int num = 4582;\n    printf(\"Sum of digits of %d = %d\\n\", num, sumOfDigits(num));\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What runtime error is produced when a recursive function lacks a valid base case in C?",
        "options": [
          "Compilation Syntax Error",
          "Bus Error",
          "Stack Overflow (SIGSEGV)",
          "Arithmetic Zero Division"
        ],
        "correctIndex": 2,
        "explanation": "Each call allocates a new stack frame. Infinite recursion consumes all reserved stack space, causing a segmentation fault (stack overflow)."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-9",
    "dayNumber": 9,
    "title": "1D Arrays & Contiguous Memory Traversal",
    "slug": "day-9-1d-arrays-and-memory",
    "summary": "Array memory layout, pointer decay, boundary violations, out-of-bounds corruption, and binary search implementation.",
    "durationMinutes": 36,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 9: 1D Arrays & Contiguous Memory\n\nAn array in C is a collection of elements of identical data types stored in **contiguous, contiguous physical memory locations**.\n\n---\n\n## Array Memory Layout in RAM\nFor an array `int arr[4] = {10, 20, 30, 40}`:\n```\n   Address:     0x1000    0x1004    0x1008    0x100C\n   Elements:   [  10  ]  [  20  ]  [  30  ]  [  40  ]\n   Indices:    arr[0]    arr[1]    arr[2]    arr[3]\n```\n\n### Crucial Reality: C Does NOT Check Bounds!\nIn languages like Python or Java, accessing `arr[10]` on a 4-element array throws an `IndexOutOfBoundsException`. In C, the CPU simply calculates `base_address + 10 * sizeof(int)` and attempts to read/write whatever arbitrary memory exists there! This is how buffer overflow security vulnerabilities are born.",
    "codeSnippet": "#include <stdio.h>\n\n// Binary search on sorted array: O(log N)\nint binarySearch(const int arr[], int size, int target) {\n    int left = 0, right = size - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\nint main(void) {\n    int scores[] = {12, 24, 38, 45, 59, 71, 88, 94};\n    int n = sizeof(scores) / sizeof(scores[0]);\n\n    printf(\"Array element count: %d\\n\", n);\n    for (int i = 0; i < n; i++) {\n        printf(\"Index %d at %p = %d\\n\", i, (void*)&scores[i], scores[i]);\n    }\n\n    int target = 59;\n    int index = binarySearch(scores, n, target);\n    printf(\"Binary Search for %d: Found at index %d\\n\", target, index);\n\n    return 0;\n}",
    "expectedOutput": "Array element count: 8\nIndex 0 at 0x7ffd... = 12\nIndex 1 at 0x7ffd... = 24\n...\nBinary Search for 59: Found at index 4",
    "practiceQuestions": [
      {
        "question": "Write a program to reverse an array in-place without creating a secondary helper array.",
        "hint": "Use two pointers (start and end) moving towards the middle while swapping elements.",
        "solutionCode": "#include <stdio.h>\n\nvoid reverseArray(int arr[], int n) {\n    int start = 0, end = n - 1;\n    while (start < end) {\n        int temp = arr[start];\n        arr[start] = arr[end];\n        arr[end] = temp;\n        start++;\n        end--;\n    }\n}\n\nint main(void) {\n    int arr[] = {1, 2, 3, 4, 5};\n    reverseArray(arr, 5);\n    for (int i = 0; i < 5; i++) printf(\"%d \", arr[i]);\n    printf(\"\\n\");\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What is the exact value returned by the sizeof(arr) operator when arr is declared as int arr[10] on a standard 64-bit OS?",
        "options": [
          "10 bytes",
          "40 bytes",
          "8 bytes",
          "4 bytes"
        ],
        "correctIndex": 1,
        "explanation": "sizeof(arr) returns total byte size = 10 elements * sizeof(int) (4 bytes each) = 40 bytes."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-10",
    "dayNumber": 10,
    "title": "2D Arrays, Matrices & Row-Major Cache Locality",
    "slug": "day-10-2d-arrays-and-matrices",
    "summary": "Row-major storage order in RAM, CPU cache lines, matrix multiplication, and passing multidimensional arrays to functions.",
    "durationMinutes": 38,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 10: 2D Arrays, Matrices & Cache Locality\n\nA 2D array in C is conceptually a grid (rows and columns), but physically inside RAM, it is stored linearly as a single continuous 1D block using **Row-Major Order**.\n\n---\n\n## Memory Address Formula for `matrix[i][j]`\n```\nAddress(matrix[i][j]) = Base_Address + (i * Total_Columns + j) * sizeof(element)\n```\n\n```\n   Row 0: [0][0], [0][1], [0][2] ───► Followed immediately in RAM by\n   Row 1: [1][0], [1][1], [1][2]\n```\n\n### CPU Cache Line Locality\nBecause modern CPUs read data from RAM in 64-byte Cache Lines, iterating through a matrix row-by-row (row-major) is up to **10x faster** than iterating column-by-column due to CPU cache hits!",
    "codeSnippet": "#include <stdio.h>\n\n#define ROWS 3\n#define COLS 3\n\nvoid printMatrix(const int m[ROWS][COLS]) {\n    for (int i = 0; i < ROWS; i++) {\n        printf(\"| \");\n        for (int j = 0; j < COLS; j++) {\n            printf(\"%3d \", m[i][j]);\n        }\n        printf(\"|\\n\");\n    }\n}\n\nint main(void) {\n    int A[ROWS][COLS] = {\n        {1, 2, 3},\n        {4, 5, 6},\n        {7, 8, 9}\n    };\n\n    printf(\"Original Matrix A:\\n\");\n    printMatrix(A);\n\n    int transpose[ROWS][COLS];\n    for (int i = 0; i < ROWS; i++) {\n        for (int j = 0; j < COLS; j++) {\n            transpose[j][i] = A[i][j];\n        }\n    }\n\n    printf(\"\\nTransposed Matrix A^T:\\n\");\n    printMatrix(transpose);\n\n    return 0;\n}",
    "expectedOutput": "Original Matrix A:\n|   1   2   3 |\n|   4   5   6 |\n|   7   8   9 |\n\nTransposed Matrix A^T:\n|   1   4   7 |\n|   2   5   8 |\n|   3   6   9 |",
    "practiceQuestions": [
      {
        "question": "Write a program to calculate the sum of the primary diagonal elements of a square matrix.",
        "hint": "Primary diagonal elements satisfy the condition row == col (i.e. matrix[i][i]).",
        "solutionCode": "#include <stdio.h>\n\nint main(void) {\n    int matrix[3][3] = {\n        {10, 2, 3},\n        {4, 20, 6},\n        {7, 8, 30}\n    };\n    int diagSum = 0;\n    for (int i = 0; i < 3; i++) {\n        diagSum += matrix[i][i];\n    }\n    printf(\"Primary Diagonal Sum = %d\\n\", diagSum);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "In C, how are multi-dimensional arrays ordered in physical memory?",
        "options": [
          "Column-Major Order",
          "Row-Major Order",
          "Z-Order Morton curve",
          "Random hashed addressing"
        ],
        "correctIndex": 1,
        "explanation": "C standard mandates Row-Major ordering: the elements of the first row are placed in contiguous memory, followed by the second row, and so on."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-11",
    "dayNumber": 11,
    "title": "Strings in C, Null Terminator (\\0) & <string.h> Internals",
    "slug": "day-11-c-strings-and-null-terminator",
    "summary": "String literals in .rodata, null byte delimiter, buffer overflows, and standard library functions strlen, strcpy, strcat, strcmp.",
    "durationMinutes": 35,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 11: Strings in C & The Null Terminator\n\nIn C, there is no native primitive `string` class. A string is simply an array of characters terminated by a special sentinel character: the **Null Terminator (`'\\0'`, ASCII value 0)**.\n\n---\n\n## Memory Representation\nWhen you declare `char str[] = \"Saksham\";`:\n```\n   Index:     0    1    2    3    4    5    6    7\n   Char:     'S'  'a'  'k'  's'  'h'  'a'  'm'  '\\0'\n   ASCII:    83   97   107  115  104  97   109   0\n```\nNotice that a 7-letter word consumes **8 bytes** in memory because of the required `'\\0'`!\n\n### Modifiable Char Array vs String Literal Pointer\n- `char s1[] = \"Hello\";` -> Stored on the Stack. Modifiable (`s1[0] = 'h';` is legal).\n- `const char *s2 = \"Hello\";` -> Stored in the Read-Only Data Segment (`.rodata`). Attempting to modify `s2[0]` causes a segmentation fault!",
    "codeSnippet": "#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char greeting[50] = \"Hello\";\n    const char *target = \"SakshamXTech\";\n\n    // 1. strlen: counts characters up to (but not including) '\\0'\n    printf(\"Length of greeting: %zu\\n\", strlen(greeting));\n\n    // 2. strcat: concatenates target onto greeting\n    strcat(greeting, \" \");\n    strcat(greeting, target);\n    printf(\"Concatenated string: %s\\n\", greeting);\n\n    // 3. strcmp: lexicographical comparison (0 if equal)\n    if (strcmp(target, \"SakshamXTech\") == 0) {\n        printf(\"String matching verified!\\n\");\n    }\n\n    return 0;\n}",
    "expectedOutput": "Length of greeting: 5\nConcatenated string: Hello SakshamXTech\nString matching verified!",
    "practiceQuestions": [
      {
        "question": "Write a program to count the number of vowels in a string using a loop.",
        "hint": "Loop until str[i] == '\\0' and check for a, e, i, o, u.",
        "solutionCode": "#include <stdio.h>\n#include <ctype.h>\n\nint main(void) {\n    char str[] = \"Systems Engineering in C\";\n    int vowels = 0;\n    for (int i = 0; str[i] != '\\0'; i++) {\n        char ch = tolower(str[i]);\n        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {\n            vowels++;\n        }\n    }\n    printf(\"Total Vowels: %d\\n\", vowels);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What is the ASCII integer value of the C string null terminator character '\\0'?",
        "options": [
          "32",
          "48",
          "0",
          "-1"
        ],
        "correctIndex": 2,
        "explanation": "The null terminator is the byte with all zero bits: binary 00000000, which has an integer ASCII value of 0."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-12",
    "dayNumber": 12,
    "title": "Building String Functions from Scratch (Without string.h)",
    "slug": "day-12-custom-string-functions",
    "summary": "Implement custom my_strlen, my_strcpy, my_strcat, and palindrome detectors using raw pointer manipulation.",
    "durationMinutes": 38,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 12: Building String Functions from Scratch\n\nRelying on `<string.h>` is great, but implementing them yourself with pointers is the true test of C mastery.\n\n---\n\n## The Philosophy of Pointer-Based String Traversal\nBecause strings end at `'\\0'`, we can iterate through memory using simple pointer incrementation:\n```c\nwhile (*str != '\\0') {\n    str++;\n}\n```",
    "codeSnippet": "#include <stdio.h>\n\n// 1. Custom strlen\nsize_t my_strlen(const char *s) {\n    const char *p = s;\n    while (*p != '\\0') p++;\n    return (size_t)(p - s);\n}\n\n// 2. Custom strcpy\nchar* my_strcpy(char *dest, const char *src) {\n    char *temp = dest;\n    while ((*dest++ = *src++) != '\\0');\n    return temp;\n}\n\n// 3. Palindrome Check\nint isPalindrome(const char *s) {\n    int left = 0;\n    int right = (int)my_strlen(s) - 1;\n    while (left < right) {\n        if (s[left] != s[right]) return 0;\n        left++;\n        right--;\n    }\n    return 1;\n}\n\nint main(void) {\n    const char *msg = \"level\";\n    char buffer[64];\n\n    printf(\"Custom strlen(\\\"%s\\\"): %zu\\n\", msg, my_strlen(msg));\n\n    my_strcpy(buffer, msg);\n    printf(\"Custom copied buffer: %s\\n\", buffer);\n\n    printf(\"Is \\\"%s\\\" a palindrome? %s\\n\", buffer, isPalindrome(buffer) ? \"YES\" : \"NO\");\n\n    return 0;\n}",
    "expectedOutput": "Custom strlen(\"level\"): 5\nCustom copied buffer: level\nIs \"level\" a palindrome? YES",
    "practiceQuestions": [
      {
        "question": "Write a custom function my_strcat(char *dest, const char *src) from scratch without using string.h.",
        "hint": "First advance dest pointer until it reaches '\\0', then copy characters from src until '\\0'.",
        "solutionCode": "#include <stdio.h>\n\nchar* my_strcat(char *dest, const char *src) {\n    char *p = dest;\n    while (*p != '\\0') p++;\n    while ((*p++ = *src++) != '\\0');\n    return dest;\n}\n\nint main(void) {\n    char greeting[50] = \"Saksham\";\n    my_strcat(greeting, \"XTech\");\n    printf(\"Result: %s\\n\", greeting);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "In the expression while((*dest++ = *src++) != '\\0'); what is the final character copied into dest?",
        "options": [
          "The first character of src",
          "The newline character",
          "The null terminator '\\0'",
          "Garbage memory"
        ],
        "correctIndex": 2,
        "explanation": "The assignment evaluates to the value assigned. The loop assigns '\\0', checks that it equals '\\0', and then terminates, correctly null-terminating the destination string."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-13",
    "dayNumber": 13,
    "title": "Pointers Unlocked: Memory Addressing & Dereferencing (*)",
    "slug": "day-13-pointers-and-dereferencing",
    "summary": "The holy grail of C: understanding pointers, dereferencing (*), NULL pointers, and preventing Segmentation Faults (SIGSEGV).",
    "durationMinutes": 42,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 13: Pointers Unlocked & Dereferencing\n\nA pointer is simply a variable whose stored value is the **memory address** of another variable.\n\n---\n\n## Visualizing Pointer Indirection\n```\n   Variable: int num = 42;                Variable: int *ptr = &num;\n   Address:  0x7fff0010                   Address:  0x7fff0020\n   Value:    [   42   ]                   Value:    [ 0x7fff0010 ]\n                                                      │\n                                                      └──────► Points to num!\n```\n\n### Two Fundamental Operators\n1. **Reference (`&`)**: \"Give me the address of this variable.\"\n2. **Dereference (`*`)**: \"Go to the address stored inside this pointer and read/write the value located there.\"\n\n### NULL Pointer Safety\nA pointer holding `NULL` (address `0x0`) points to unmapped virtual memory. Dereferencing `NULL` causes the operating system MMU to instantly trigger a **Segmentation Fault (`SIGSEGV`)**. Always check `if (ptr != NULL)` before dereferencing!",
    "codeSnippet": "#include <stdio.h>\n\nint main(void) {\n    int score = 100;\n    int *ptr = &score; // ptr holds memory address of score\n\n    printf(\"Value of score:        %d\\n\", score);\n    printf(\"Address of score (&):  %p\\n\", (void*)&score);\n    printf(\"Value stored in ptr:   %p\\n\", (void*)ptr);\n    printf(\"Dereferenced (*ptr):   %d\\n\", *ptr);\n\n    // Modifying score via pointer dereferencing\n    *ptr = 250;\n    printf(\"\\nAfter *ptr = 250;\\n\");\n    printf(\"New value of score:    %d\\n\", score);\n\n    // Safe NULL check demo\n    int *badPtr = NULL;\n    if (badPtr == NULL) {\n        printf(\"Safe Guard: badPtr is NULL, skipping dereference to prevent crash!\\n\");\n    }\n\n    return 0;\n}",
    "expectedOutput": "Value of score:        100\nAddress of score (&):  0x7ffd...\nValue stored in ptr:   0x7ffd...\nDereferenced (*ptr):   100\n\nAfter *ptr = 250;\nNew value of score:    250\nSafe Guard: badPtr is NULL, skipping dereference to prevent crash!",
    "practiceQuestions": [
      {
        "question": "Declare a float variable x = 3.14. Create a pointer to it, double the value of x using only the pointer, and print x.",
        "hint": "Use *ptr = *ptr * 2;",
        "solutionCode": "#include <stdio.h>\n\nint main(void) {\n    float x = 3.14f;\n    float *ptr = &x;\n    *ptr *= 2.0f;\n    printf(\"Updated x = %.2f\\n\", x);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What happens when a C program executes *ptr = 5; when ptr contains NULL (0x0)?",
        "options": [
          "It assigns 5 to the 0th index of the stack",
          "It throws a NullPointerException caught by libc",
          "The OS MMU triggers a Segmentation Fault (SIGSEGV) and terminates the program",
          "The value is silently discarded"
        ],
        "correctIndex": 2,
        "explanation": "Address 0x0 is not mapped into user space; accessing it triggers a page fault that the operating system kernel handles by raising SIGSEGV."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-14",
    "dayNumber": 14,
    "title": "Pointer Arithmetic, Array Pointers & arr[i] vs *(arr+i)",
    "slug": "day-14-pointer-arithmetic",
    "summary": "The secret identity: arr[i] is literally syntactic sugar for *(arr + i). Learn byte stride scaling and pointer arithmetic rules.",
    "durationMinutes": 36,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 14: Pointer Arithmetic & Array Decay\n\nPointer arithmetic does **NOT** add raw bytes. It advances by the **size of the underlying type (stride)**!\n\n---\n\n## Pointer Addition Formula\nWhen you write `ptr + 1` where `ptr` is of type `T*`:\n```\nNew_Address = Current_Address + 1 * sizeof(T)\n```\nIf `sizeof(int) == 4` bytes, incrementing an `int*` increases the hexadecimal address by **4**, not 1!\n\n### The Equivalence Theorem\nIn C, the subscript notation `arr[i]` is literally defined by the compiler as:\n```c\narr[i]  <===>  *(arr + i)  <===>  *(i + arr)  <===>  i[arr]\n```\nYes! Because addition is commutative, `2[arr]` is completely legal C syntax!",
    "codeSnippet": "#include <stdio.h>\n\nint main(void) {\n    int numbers[] = {10, 20, 30, 40, 50};\n    int *ptr = numbers; // numbers decays into pointer to first element\n\n    printf(\"Base Address of array:  %p\\n\", (void*)ptr);\n    printf(\"Address after (ptr + 1):%p (+%zu bytes)\\n\", \n           (void*)(ptr + 1), sizeof(int));\n\n    printf(\"\\nTraversing array using Pointer Arithmetic:\\n\");\n    for (int i = 0; i < 5; i++) {\n        printf(\"Index %d: arr[%d]=%d | *(ptr+%d)=%d | %d[arr]=%d\\n\", \n               i, i, numbers[i], i, *(ptr + i), i, i[numbers]);\n    }\n\n    return 0;\n}",
    "expectedOutput": "Base Address of array:  0x7ffd...\nAddress after (ptr + 1):0x7ffd... (+4 bytes)\n\nTraversing array using Pointer Arithmetic:\nIndex 0: arr[0]=10 | *(ptr+0)=10 | 0[arr]=10\nIndex 1: arr[1]=20 | *(ptr+1)=20 | 1[arr]=20\nIndex 2: arr[2]=30 | *(ptr+2)=30 | 2[arr]=30\nIndex 3: arr[3]=40 | *(ptr+3)=40 | 3[arr]=40\nIndex 4: arr[4]=50 | *(ptr+4)=50 | 4[arr]=50",
    "practiceQuestions": [
      {
        "question": "Write a function sumArray(const int *start, const int *end) that sums elements by moving a pointer from start to end.",
        "hint": "Iterate while start < end and accumulate *start++.",
        "solutionCode": "#include <stdio.h>\n\nint sumArray(const int *start, const int *end) {\n    int total = 0;\n    while (start < end) {\n        total += *start++;\n    }\n    return total;\n}\n\nint main(void) {\n    int data[] = {5, 10, 15, 20};\n    int total = sumArray(data, data + 4);\n    printf(\"Total sum = %d\\n\", total);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "If double *p = (double*)0x1000; and sizeof(double) is 8 bytes, what is the value of p + 2?",
        "options": [
          "0x1002",
          "0x1008",
          "0x1010",
          "0x1016"
        ],
        "correctIndex": 2,
        "explanation": "Pointer arithmetic scales by sizeof(double) = 8. 0x1000 + 2 * 8 = 0x1000 + 16 (0x10 in hex) = 0x1010."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-15",
    "dayNumber": 15,
    "title": "Double Pointers (**ptr) & Modifying Pointers by Reference",
    "slug": "day-15-double-pointers",
    "summary": "Master pointers to pointers (**ptr), dynamic 2D memory arrays, and altering caller pointer values inside helper functions.",
    "durationMinutes": 38,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 15: Double Pointers & Indirection Chains\n\nA double pointer (`T**`) is a pointer that holds the memory address of another pointer variable.\n\n---\n\n## Indirection Hierarchy\n```\n   Variable:    int val = 500;\n   Pointer:     int *p1 = &val;\n   Double Ptr:  int **p2 = &p1;\n\n   [ p2: 0x3000 ] ──► [ p1: 0x2000 ] ──► [ val: 0x1000 = 500 ]\n```\n\n### When are Double Pointers Mandatory?\nIf you want a function to modify where a caller's pointer points (for example, allocating memory or reassigning a node in a Linked List), you **must** pass a double pointer!",
    "codeSnippet": "#include <stdio.h>\n\nvoid allocateNumber(int **targetPtr, int initialValue) {\n    static int persistentStorage = 0;\n    persistentStorage = initialValue;\n    // Modifying the caller's pointer address!\n    *targetPtr = &persistentStorage;\n}\n\nint main(void) {\n    int value = 777;\n    int *ptr = &value;\n    int **doublePtr = &ptr;\n\n    printf(\"Direct value:            %d\\n\", value);\n    printf(\"Single dereference (*):  %d\\n\", *ptr);\n    printf(\"Double dereference (**): %d\\n\", **doublePtr);\n\n    // Passing pointer by reference\n    int *dynamicTarget = NULL;\n    allocateNumber(&dynamicTarget, 999);\n    printf(\"Value after allocateNumber: %d\\n\", *dynamicTarget);\n\n    return 0;\n}",
    "expectedOutput": "Direct value:            777\nSingle dereference (*):  777\nDouble dereference (**): 777\nValue after allocateNumber: 999",
    "practiceQuestions": [
      {
        "question": "Write a program demonstrating how to change the target of a char* string pointer inside a function using a char** double pointer.",
        "hint": "Function prototype: void setGreeting(const char **ptr);",
        "solutionCode": "#include <stdio.h>\n\nvoid setGreeting(const char **ptr) {\n    *ptr = \"Hello from SakshamXTech!\";\n}\n\nint main(void) {\n    const char *msg = \"Default\";\n    printf(\"Before: %s\\n\", msg);\n    setGreeting(&msg);\n    printf(\"After:  %s\\n\", msg);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "Why do linked list insertion functions often require a double pointer (Node **head)?",
        "options": [
          "Because nodes are twice as large as regular variables",
          "To enable the function to alter the caller's head pointer when inserting at the front",
          "Because C does not allow single pointers to structures",
          "To optimize CPU cache prefetching"
        ],
        "correctIndex": 1,
        "explanation": "To update the caller's actual head pointer variable, its memory address (Node**) must be passed to the function."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-16",
    "dayNumber": 16,
    "title": "Void Pointers (void*) & Generic Memory Operations",
    "slug": "day-16-void-pointers-and-generic-c",
    "summary": "Polymorphism in raw C: void pointers (void*), typecasting, and building generic byte-swapping functions.",
    "durationMinutes": 35,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 16: Void Pointers & Generic Programming\n\nA `void*` (generic pointer) represents a raw memory address with no associated data type or byte stride.\n\n---\n\n## Rules of Void Pointers\n1. **Any pointer can be assigned to `void*`** without an explicit cast.\n2. **A `void*` cannot be directly dereferenced** (`*vptr` is invalid) because the compiler has no knowledge of how many bytes to read!\n3. **Pointer arithmetic on `void*` is undefined in ANSI C** (though GCC treats it as 1-byte stride as an extension).\n\n### Building Generic Byte Swappers (Mimicking Templates)\nBy treating memory as raw arrays of `unsigned char`, we can write generic functions that operate on any data type in C!",
    "codeSnippet": "#include <stdio.h>\n#include <string.h>\n\n// Generic memory swapper: works on ints, floats, structs, strings!\nvoid genericSwap(void *a, void *b, size_t size) {\n    unsigned char temp[size];\n    memcpy(temp, a, size);\n    memcpy(a, b, size);\n    memcpy(b, temp, size);\n}\n\nint main(void) {\n    int i1 = 100, i2 = 200;\n    printf(\"Before int swap:    %d, %d\\n\", i1, i2);\n    genericSwap(&i1, &i2, sizeof(int));\n    printf(\"After int swap:     %d, %d\\n\", i1, i2);\n\n    double d1 = 3.1415, d2 = 2.7182;\n    printf(\"Before double swap: %.4f, %.4f\\n\", d1, d2);\n    genericSwap(&d1, &d2, sizeof(double));\n    printf(\"After double swap:  %.4f, %.4f\\n\", d1, d2);\n\n    return 0;\n}",
    "expectedOutput": "Before int swap:    100, 200\nAfter int swap:     200, 100\nBefore double swap: 3.1415, 2.7182\nAfter double swap:  2.7182, 3.1415",
    "practiceQuestions": [
      {
        "question": "Write a generic function printRawBytes(const void *object, size_t bytes) that displays the raw hexadecimal bytes of any variable.",
        "hint": "Cast object to const unsigned char* and iterate byte-by-byte.",
        "solutionCode": "#include <stdio.h>\n\nvoid printRawBytes(const void *object, size_t bytes) {\n    const unsigned char *bytePtr = (const unsigned char*)object;\n    printf(\"Raw Bytes: \");\n    for (size_t i = 0; i < bytes; i++) {\n        printf(\"%02X \", bytePtr[i]);\n    }\n    printf(\"\\n\");\n}\n\nint main(void) {\n    int n = 0x12345678;\n    printRawBytes(&n, sizeof(n));\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "Why does ANSI C prohibit direct dereferencing of a void* pointer (e.g., *vptr)?",
        "options": [
          "Because void pointers point to read-only memory",
          "Because the compiler does not know the size or type of the underlying data being referenced",
          "Because void pointers are restricted to kernel mode",
          "Because void is a reserved keyword for functions only"
        ],
        "correctIndex": 1,
        "explanation": "Without a concrete type (like int or char), the compiler cannot determine how many bytes to read or how to interpret the binary bit pattern."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-17",
    "dayNumber": 17,
    "title": "Function Pointers, Callbacks & Dispatch Tables",
    "slug": "day-17-function-pointers-and-callbacks",
    "summary": "Store code addresses in variables: callback design, qsort comparators, and event-driven architectures in C.",
    "durationMinutes": 40,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 17: Function Pointers & Callbacks\n\nIn C, compiled machine code instructions reside in the **Text Segment (.text)** of RAM. Just like variables, every function has an entry point memory address.\n\n---\n\n## Syntax Demystified\n```c\nreturn_type (*pointer_name)(parameter_types);\n```\nExample:\n```c\nint (*operation)(int, int); // A pointer to any function taking two ints and returning an int\n```\n\n### Practical Use Cases\n- Event Callbacks (e.g. GUI click listeners, network packet handlers)\n- Sorting comparators (like standard `qsort`)\n- Dispatch tables for state machines and video game input loops.",
    "codeSnippet": "#include <stdio.h>\n#include <stdlib.h>\n\n// Arithmetic Functions\nint add(int a, int b) { return a + b; }\nint multiply(int a, int b) { return a * b; }\n\n// qsort comparator for descending order\nint compareDescending(const void *a, const void *b) {\n    int arg1 = *(const int*)a;\n    int arg2 = *(const int*)b;\n    if (arg1 < arg2) return 1;\n    if (arg1 > arg2) return -1;\n    return 0;\n}\n\nint main(void) {\n    // 1. Function Pointer variable\n    int (*calc)(int, int) = add;\n    printf(\"Function Pointer add(10, 5) = %d\\n\", calc(10, 5));\n\n    calc = multiply;\n    printf(\"Function Pointer multiply(10, 5) = %d\\n\", calc(10, 5));\n\n    // 2. Standard library qsort with callback\n    int arr[] = {42, 12, 88, 3, 27};\n    qsort(arr, 5, sizeof(int), compareDescending);\n\n    printf(\"Sorted Descending with qsort callback: \");\n    for (int i = 0; i < 5; i++) printf(\"%d \", arr[i]);\n    printf(\"\\n\");\n\n    return 0;\n}",
    "expectedOutput": "Function Pointer add(10, 5) = 15\nFunction Pointer multiply(10, 5) = 50\nSorted Descending with qsort callback: 88 42 27 12 3 ",
    "practiceQuestions": [
      {
        "question": "Create an array of function pointers (dispatch table) containing 4 basic math operations (+, -, *, /) and invoke them in a loop.",
        "hint": "int (*ops[4])(int, int) = {add, sub, mul, div};",
        "solutionCode": "#include <stdio.h>\n\nint add(int a, int b) { return a + b; }\nint sub(int a, int b) { return a - b; }\n\nint main(void) {\n    int (*ops[])(int, int) = {add, sub};\n    printf(\"Add: %d\\n\", ops[0](20, 10));\n    printf(\"Sub: %d\\n\", ops[1](20, 10));\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "Which C standard library function relies on a function pointer callback to order elements?",
        "options": [
          "printf",
          "qsort",
          "malloc",
          "memcpy"
        ],
        "correctIndex": 1,
        "explanation": "qsort takes an int (*compar)(const void*, const void*) function pointer callback to compare elements."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-18",
    "dayNumber": 18,
    "title": "Dynamic Memory Allocation (DMA): malloc, calloc, realloc, free",
    "slug": "day-18-dynamic-memory-allocation",
    "summary": "Stack vs Heap: allocating memory at runtime using malloc, zero-initialization with calloc, resizing with realloc, and memory lifecycle with free.",
    "durationMinutes": 44,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 18: Dynamic Memory Allocation (The Heap)\n\nStack memory is fixed and limited at compile time. When you need memory whose size depends on runtime user input or files, you must request it from the **Heap**.\n\n---\n\n## The 4 Pillars of DMA in `<stdlib.h>`\n1. `malloc(size_t size)`: Allocates raw, uninitialized memory. Returns pointer or `NULL` if allocation fails.\n2. `calloc(size_t num, size_t size)`: Allocates memory and clears all bytes to zero (**zero-initialized**).\n3. `realloc(void *ptr, size_t new_size)`: Resizes an existing heap allocation without losing current data.\n4. `free(void *ptr)`: Returns allocated heap memory back to the Operating System.\n\n### Golden Rules\n- **Rule 1**: ALWAYS check if the returned pointer is `NULL` before using it.\n- **Rule 2**: Every `malloc` must have exactly one matching `free`.",
    "codeSnippet": "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int initialSize = 3;\n    int *arr = (int*)malloc(initialSize * sizeof(int));\n    if (arr == NULL) {\n        fprintf(stderr, \"Heap allocation failed!\\n\");\n        return 1;\n    }\n\n    for (int i = 0; i < initialSize; i++) arr[i] = (i + 1) * 10;\n    printf(\"Initial Heap Array: \");\n    for (int i = 0; i < initialSize; i++) printf(\"%d \", arr[i]);\n    printf(\"\\n\");\n\n    // Dynamic Resizing with realloc\n    int newSize = 5;\n    int *temp = (int*)realloc(arr, newSize * sizeof(int));\n    if (temp == NULL) {\n        free(arr);\n        return 1;\n    }\n    arr = temp;\n    arr[3] = 40;\n    arr[4] = 50;\n\n    printf(\"Resized Heap Array: \");\n    for (int i = 0; i < newSize; i++) printf(\"%d \", arr[i]);\n    printf(\"\\n\");\n\n    // Clean up\n    free(arr);\n    arr = NULL; // Prevent dangling pointer!\n\n    return 0;\n}",
    "expectedOutput": "Initial Heap Array: 10 20 30 \nResized Heap Array: 10 20 30 40 50 ",
    "practiceQuestions": [
      {
        "question": "Write a program that uses calloc to allocate an array of 5 floats, verifies that all elements are 0.0, modifies them, and frees the memory.",
        "hint": "float *arr = (float*)calloc(5, sizeof(float));",
        "solutionCode": "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    float *data = (float*)calloc(5, sizeof(float));\n    if (!data) return 1;\n    for (int i = 0; i < 5; i++) {\n        printf(\"%.1f \", data[i]);\n    }\n    printf(\"\\n\");\n    free(data);\n    data = NULL;\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What is the key difference between malloc() and calloc()?",
        "options": [
          "calloc allocates on the stack, malloc on the heap",
          "calloc initializes all allocated bytes to zero; malloc leaves memory uninitialized (garbage values)",
          "malloc automatically frees itself after scope exit",
          "calloc cannot fail"
        ],
        "correctIndex": 1,
        "explanation": "calloc zeros out the entire block of allocated bytes, whereas malloc leaves the raw memory uninitialized."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-19",
    "dayNumber": 19,
    "title": "Heap Diagnostics: Memory Leaks, Dangling Pointers & Valgrind",
    "slug": "day-19-memory-leaks-and-heap-diagnostics",
    "summary": "Eliminate catastrophic heap bugs: memory leaks, dangling pointers, double frees, and running Valgrind Memcheck.",
    "durationMinutes": 36,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 19: Heap Diagnostics & Memory Safety\n\nHeap corruption is the #1 cause of crashes and security exploits in C programs.\n\n---\n\n## The 3 Big Heap Vulnerabilities\n1. **Memory Leak**: Allocating memory with `malloc` and losing the pointer without calling `free`. Over time, the server runs out of RAM.\n2. **Dangling Pointer**: A pointer that still points to a memory address that has already been deallocated by `free()`. Accessing it is Undefined Behavior!\n   - *Fix*: Immediately set `ptr = NULL;` right after `free(ptr);`.\n3. **Double Free**: Calling `free()` twice on the same memory address. This corrupts internal glibc heap bins and triggers abort.\n\n### Inspecting Leaks with Valgrind\n```bash\ngcc -g main.c -o main\nvalgrind --leak-check=full ./main\n```",
    "codeSnippet": "#include <stdio.h>\n#include <stdlib.h>\n\nvoid safeMemoryLifecycle(void) {\n    int *buffer = (int*)malloc(100 * sizeof(int));\n    if (buffer == NULL) return;\n\n    buffer[0] = 42;\n    printf(\"Heap buffer safely accessed: %d\\n\", buffer[0]);\n\n    // 1. Always Free\n    free(buffer);\n\n    // 2. Neutralize Dangling Pointer\n    buffer = NULL;\n\n    // 3. Defensive Check\n    if (buffer == NULL) {\n        printf(\"Pointer successfully neutralized to NULL. No dangling pointer!\\n\");\n    }\n}\n\nint main(void) {\n    safeMemoryLifecycle();\n    return 0;\n}",
    "expectedOutput": "Heap buffer safely accessed: 42\nPointer successfully neutralized to NULL. No dangling pointer!",
    "practiceQuestions": [
      {
        "question": "Write a small program that safely reallocates a dynamic buffer and guards against memory leaks in case realloc returns NULL.",
        "hint": "Use a temporary pointer: void *temp = realloc(...); if (!temp) { free(original); }",
        "solutionCode": "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int *arr = malloc(10 * sizeof(int));\n    if (!arr) return 1;\n\n    int *temp = realloc(arr, 20 * sizeof(int));\n    if (!temp) {\n        free(arr);\n        fprintf(stderr, \"Realloc failed!\\n\");\n        return 1;\n    }\n    arr = temp;\n    printf(\"Realloc succeeded without memory leaks!\\n\");\n    free(arr);\n    arr = NULL;\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What is the immediate best practice after invoking free(ptr); in C?",
        "options": [
          "Re-assign ptr = malloc(sizeof(ptr));",
          "Assign ptr = NULL; to prevent dangling pointer access",
          "Call memset on ptr",
          "Nothing, the OS zeroes the pointer variable"
        ],
        "correctIndex": 1,
        "explanation": "Setting ptr = NULL ensures that any subsequent accidental dereference will trigger a clear, predictable fault rather than corrupting random heap data."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-20",
    "dayNumber": 20,
    "title": "Structures (struct), Member Memory Offsets & Byte Alignment",
    "slug": "day-20-c-structures-and-memory-padding",
    "summary": "Custom compound types, structure memory layout, compiler padding bytes, and the #pragma pack directive.",
    "durationMinutes": 40,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 20: Structures & Compiler Memory Alignment\n\nA `struct` bundles related heterogeneous variables into a single aggregate type.\n\n---\n\n## The Mystery of Structure Padding & Alignment\nConsider this struct:\n```c\nstruct BadLayout {\n    char a;   // 1 byte\n    int b;    // 4 bytes\n    char c;   // 1 byte\n};\n```\nYou might expect `1 + 4 + 1 = 6` bytes. But `sizeof(struct BadLayout)` is actually **12 bytes**!\n\n### Why? CPU Word Alignment!\nModern 64-bit CPUs read memory in 4-byte or 8-byte word boundaries. Accessing an unaligned 4-byte integer requires two memory bus cycles instead of one. So the compiler inserts **invisible padding bytes**:\n```\n   Byte 0:  [ char a ]\n   Byte 1-3:[ PADDING ] (3 wasted bytes)\n   Byte 4-7:[ int b   ]\n   Byte 8:  [ char c ]\n   Byte 9-11:[ PADDING ] (3 wasted bytes to align struct size to multiple of 4)\n```\n**Pro Tip**: Order struct members from largest to smallest to minimize padding waste!",
    "codeSnippet": "#include <stdio.h>\n#include <stddef.h>\n\nstruct Student {\n    char rank;      // 1 byte\n    int studentId;  // 4 bytes\n    double gpa;     // 8 bytes\n};\n\nint main(void) {\n    struct Student s1 = {'A', 1042, 3.89};\n\n    printf(\"--- Student Struct Memory Layout ---\\n\");\n    printf(\"Total Size:        %zu bytes\\n\", sizeof(struct Student));\n    printf(\"Offset of [rank]:      %zu bytes\\n\", offsetof(struct Student, rank));\n    printf(\"Offset of [studentId]: %zu bytes\\n\", offsetof(struct Student, studentId));\n    printf(\"Offset of [gpa]:       %zu bytes\\n\", offsetof(struct Student, gpa));\n\n    printf(\"\\nData: ID=%d, Rank=%c, GPA=%.2f\\n\", s1.studentId, s1.rank, s1.gpa);\n\n    return 0;\n}",
    "expectedOutput": "--- Student Struct Memory Layout ---\nTotal Size:        16 bytes\nOffset of [rank]:      0 bytes\nOffset of [studentId]: 4 bytes\nOffset of [gpa]:       8 bytes\n\nData: ID=1042, Rank=A, GPA=3.89",
    "practiceQuestions": [
      {
        "question": "Reorder the members of struct Sensor { char id; double value; char status; int counter; } to minimize memory padding.",
        "hint": "Sort members by size: double (8), int (4), char (1), char (1).",
        "solutionCode": "#include <stdio.h>\n\nstruct OptimalSensor {\n    double value;  // 8 bytes\n    int counter;   // 4 bytes\n    char id;       // 1 byte\n    char status;   // 1 byte\n    // 2 bytes trailing padding to multiple of 8\n};\n\nint main(void) {\n    printf(\"Optimized Struct Size: %zu bytes\\n\", sizeof(struct OptimalSensor));\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "Which macro from <stddef.h> returns the exact byte offset of a structure member from the beginning of the struct?",
        "options": [
          "sizeof()",
          "offsetof()",
          "alignof()",
          "memoffset()"
        ],
        "correctIndex": 1,
        "explanation": "offsetof(struct_type, member_name) returns the byte distance from the start of the structure."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-21",
    "dayNumber": 21,
    "title": "Pointers to Structures & The Arrow Operator (->)",
    "slug": "day-21-pointers-to-structures",
    "summary": "Dynamic struct allocation, passing structs by pointer to avoid stack copies, and the arrow operator (->).",
    "durationMinutes": 38,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 21: Pointers to Structures & The Arrow Operator\n\nPassing large structures by value copies every single byte onto the stack frame. In high-performance software, we always pass **pointers to structures**.\n\n---\n\n## Dot (.) vs Arrow (`->`)\n- Dot operator (`.`): Used when you have a direct struct variable (`s.age`).\n- Arrow operator (`->`): Used when you have a **pointer** to a struct (`ptr->age`).\n```c\nptr->age  <===>  (*ptr).age\n```\nThe parentheses in `(*ptr).age` are mandatory because the dot operator has higher precedence than the dereference operator `*`. The arrow operator was created specifically to make this clean and readable!",
    "codeSnippet": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct {\n    char name[32];\n    int port;\n    int isRunning;\n} ServerNode;\n\n// Function takes pointer: 0 memory copy overhead!\nvoid startServer(ServerNode *server) {\n    if (server == NULL) return;\n    server->isRunning = 1;\n    printf(\"Server [%s] started successfully on port %d!\\n\", \n           server->name, server->port);\n}\n\nint main(void) {\n    // Dynamically allocate struct on the Heap\n    ServerNode *master = (ServerNode*)malloc(sizeof(ServerNode));\n    if (!master) return 1;\n\n    strncpy(master->name, \"Prod-Gateway-01\", sizeof(master->name));\n    master->port = 8080;\n    master->isRunning = 0;\n\n    startServer(master);\n\n    free(master);\n    master = NULL;\n\n    return 0;\n}",
    "expectedOutput": "Server [Prod-Gateway-01] started successfully on port 8080!",
    "practiceQuestions": [
      {
        "question": "Write a function updateCoordinates(struct Point *p, int dx, int dy) that modifies a Point struct using the arrow operator.",
        "hint": "p->x += dx; p->y += dy;",
        "solutionCode": "#include <stdio.h>\n\nstruct Point { int x; int y; };\n\nvoid updateCoordinates(struct Point *p, int dx, int dy) {\n    p->x += dx;\n    p->y += dy;\n}\n\nint main(void) {\n    struct Point pt = {10, 20};\n    updateCoordinates(&pt, 5, -10);\n    printf(\"Updated Point: (%d, %d)\\n\", pt.x, pt.y);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "The expression ptr->value is identical in meaning to which of the following?",
        "options": [
          "*ptr.value",
          "*(ptr.value)",
          "(*ptr).value",
          "&ptr->value"
        ],
        "correctIndex": 2,
        "explanation": "Because . has higher precedence than *, (*ptr).value dereferences the pointer first, which is identical to ptr->value."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-22",
    "dayNumber": 22,
    "title": "Unions (union), Shared Memory & Low-Level Type Punning",
    "slug": "day-22-c-unions-and-type-punning",
    "summary": "Memory sharing among members, hardware protocol decoding, and low-level type punning via unions.",
    "durationMinutes": 34,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 22: Unions & Shared Memory\n\nWhile a `struct` allocates separate memory space for each member, a `union` forces all members to **share the exact same memory location**.\n\n---\n\n## Memory Footprint of a Union\nThe size of a union is simply equal to the size of its **largest single member**:\n```c\nunion Data {\n    char byteVal;    // 1 byte\n    int intVal;      // 4 bytes\n    double dblVal;   // 8 bytes\n};\n// sizeof(union Data) == 8 bytes!\n```\n\n### Real-World Use: IP Address Packet Decoding\nNetworking protocols use unions to view the same 32-bit IPv4 address either as an integer or as 4 individual octet bytes!",
    "codeSnippet": "#include <stdio.h>\n\nunion IPv4 {\n    unsigned int rawAddress;       // 32-bit integer representation\n    unsigned char octets[4];       // 4 individual byte octets\n};\n\nint main(void) {\n    union IPv4 ip;\n    // Set 127.0.0.1 (Loopback)\n    ip.octets[0] = 127;\n    ip.octets[1] = 0;\n    ip.octets[2] = 0;\n    ip.octets[3] = 1;\n\n    printf(\"Total Union Size: %zu bytes\\n\", sizeof(union IPv4));\n    printf(\"IP in dotted-quad: %d.%d.%d.%d\\n\", \n           ip.octets[0], ip.octets[1], ip.octets[2], ip.octets[3]);\n    printf(\"Raw 32-bit Integer: 0x%08X (%u)\\n\", ip.rawAddress, ip.rawAddress);\n\n    return 0;\n}",
    "expectedOutput": "Total Union Size: 4 bytes\nIP in dotted-quad: 127.0.0.1\nRaw 32-bit Integer: 0x0100007F (16777343)",
    "practiceQuestions": [
      {
        "question": "Use a union to inspect the endianness of your computer architecture (Little Endian vs Big Endian).",
        "hint": "Store 1 in an int member and check if the first byte of a char array member is 1.",
        "solutionCode": "#include <stdio.h>\n\nint main(void) {\n    union {\n        int i;\n        char c[sizeof(int)];\n    } test;\n    test.i = 1;\n    if (test.c[0] == 1) {\n        printf(\"Architecture: Little Endian\\n\");\n    } else {\n        printf(\"Architecture: Big Endian\\n\");\n    }\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What is the total size in memory of a union containing a char (1 byte), an int (4 bytes), and a double (8 bytes)?",
        "options": [
          "13 bytes",
          "8 bytes",
          "16 bytes",
          "4 bytes"
        ],
        "correctIndex": 1,
        "explanation": "A union shares memory across all members. Its size is determined by its largest member (double, which is 8 bytes)."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-23",
    "dayNumber": 23,
    "title": "Enumerations (enum) & typedef Abstraction",
    "slug": "day-23-enums-and-typedef",
    "summary": "Cleaner code architectures: creating human-readable state machines with enum and concise types using typedef.",
    "durationMinutes": 30,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 23: Enums & Type Abstraction with typedef\n\nClean systems architecture demands self-documenting, type-safe state representations.\n\n---\n\n## 1. Enumerations (`enum`)\nAn `enum` defines a set of named integer constants. By default, the first enumerator starts at 0 and increments by 1.\n```c\ntypedef enum {\n    STATE_IDLE,       // 0\n    STATE_CONNECTING, // 1\n    STATE_CONNECTED,  // 2\n    STATE_ERROR = -1  // Custom assignment\n} ConnectionState;\n```\n\n## 2. Type Aliasing (`typedef`)\n`typedef` gives new names to existing types, preventing repetitive `struct MyStruct` qualifiers and providing portable fixed-width aliases (like `uint32_t` in `<stdint.h>`).",
    "codeSnippet": "#include <stdio.h>\n\ntypedef enum {\n    LOG_DEBUG,\n    LOG_INFO,\n    LOG_WARN,\n    LOG_ERROR\n} LogLevel;\n\nvoid logMessage(LogLevel level, const char *msg) {\n    const char *prefixes[] = {\"[DEBUG]\", \"[INFO] \", \"[WARN] \", \"[ERROR]\"};\n    printf(\"%s %s\\n\", prefixes[level], msg);\n}\n\nint main(void) {\n    logMessage(LOG_INFO, \"SakshamXTech C Kernel online.\");\n    logMessage(LOG_WARN, \"CPU thermals elevated at 78C.\");\n    logMessage(LOG_ERROR, \"Disk connection dropped.\");\n    return 0;\n}",
    "expectedOutput": "[INFO]  SakshamXTech C Kernel online.\n[WARN]  CPU thermals elevated at 78C.\n[ERROR] Disk connection dropped.",
    "practiceQuestions": [
      {
        "question": "Define an enum for DaysOfWeek (MON=1, TUE, WED, THU, FRI, SAT, SUN) and write a function isWeekend(Day d).",
        "hint": "Assign MON = 1, then check if d == SAT || d == SUN.",
        "solutionCode": "#include <stdio.h>\n\ntypedef enum {\n    MON = 1, TUE, WED, THU, FRI, SAT, SUN\n} Day;\n\nint isWeekend(Day d) {\n    return (d == SAT || d == SUN);\n}\n\nint main(void) {\n    printf(\"Is Sunday weekend? %s\\n\", isWeekend(SUN) ? \"YES\" : \"NO\");\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "If an enum is declared as enum Color { RED, GREEN = 5, BLUE }; what is the integer value of BLUE?",
        "options": [
          "2",
          "6",
          "5",
          "0"
        ],
        "correctIndex": 1,
        "explanation": "Each subsequent enum constant without an explicit value increments the previous constant by 1. Since GREEN is 5, BLUE becomes 6."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-24",
    "dayNumber": 24,
    "title": "Bit Fields & Microcontroller Register Manipulation",
    "slug": "day-24-bit-fields-and-hardware-registers",
    "summary": "Hardware register packing: squeezing boolean flags into exact bit counts (1-bit, 2-bit) for embedded systems and network protocols.",
    "durationMinutes": 36,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 24: Bit Fields & Hardware Register Packing\n\nIn standard C, even a boolean flag takes a full 8-bit `char` or 32-bit `int`. When designing microcontrollers (STM32, ESP32) or network headers (TCP flags), every bit counts!\n\n---\n\n## Bit Field Declaration Syntax\n```c\nstruct TCPHeaderFlags {\n    unsigned int fin : 1; // 1 bit\n    unsigned int syn : 1; // 1 bit\n    unsigned int rst : 1; // 1 bit\n    unsigned int psh : 1; // 1 bit\n    unsigned int ack : 1; // 1 bit\n    unsigned int urg : 1; // 1 bit\n    unsigned int reserved : 2; // 2 bits padding\n};\n// Packs 6 individual flags into a single 1-byte storage container!\n```",
    "codeSnippet": "#include <stdio.h>\n\nstruct DeviceControlRegister {\n    unsigned int powerOn    : 1; // bit 0\n    unsigned int ledColor   : 3; // bits 1-3 (Values 0-7)\n    unsigned int fanSpeed   : 4; // bits 4-7 (Values 0-15)\n};\n\nint main(void) {\n    struct DeviceControlRegister reg = {0};\n\n    reg.powerOn = 1;\n    reg.ledColor = 5;  // 101 binary\n    reg.fanSpeed = 12; // 1100 binary\n\n    printf(\"Device Control Register Size: %zu byte\\n\", sizeof(reg));\n    printf(\"Power Status: %u\\n\", reg.powerOn);\n    printf(\"LED Color:    %u / 7\\n\", reg.ledColor);\n    printf(\"Fan Speed:    %u / 15\\n\", reg.fanSpeed);\n\n    return 0;\n}",
    "expectedOutput": "Device Control Register Size: 4 byte\nPower Status: 1\nLED Color:    5 / 7\nFan Speed:    12 / 15",
    "practiceQuestions": [
      {
        "question": "Define a struct using bit fields to represent a Date (day: 5 bits [1-31], month: 4 bits [1-12], year: 12 bits [0-4095]).",
        "hint": "unsigned int day: 5; unsigned int month: 4; unsigned int year: 12;",
        "solutionCode": "#include <stdio.h>\n\nstruct CompactDate {\n    unsigned int day   : 5;\n    unsigned int month : 4;\n    unsigned int year  : 12;\n};\n\nint main(void) {\n    struct CompactDate dt = {25, 12, 2026};\n    printf(\"Date: %02u/%02u/%u\\n\", dt.day, dt.month, dt.year);\n    printf(\"Total memory footprint: %zu bytes\\n\", sizeof(dt));\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What is the maximum integer value that an unsigned 3-bit field (unsigned int x : 3;) can hold?",
        "options": [
          "3",
          "7",
          "8",
          "15"
        ],
        "correctIndex": 1,
        "explanation": "A 3-bit unsigned integer can represent values from 000 (0) up to 111 (2^3 - 1 = 7)."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-25",
    "dayNumber": 25,
    "title": "Text File I/O: fopen, fclose, fgetc, fgets & Stream Buffering",
    "slug": "day-25-text-file-io",
    "summary": "Master file streams: FILE pointer, fopen modes, buffer flushing, and safe line-by-line reading with fgets.",
    "durationMinutes": 38,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 25: Text File I/O & Streams\n\nIn UNIX and C philosophy, \"Everything is a File\". Disk files are accessed via buffered streams managed by the `FILE*` structure.\n\n---\n\n## File Access Modes\n- `\"r\"`: Read only (file must already exist).\n- `\"w\"`: Write only (truncates existing file to 0 bytes or creates new file).\n- `\"a\"`: Append (writes always happen at end of file).\n- `\"r+\"`: Read and write.\n\n### Critical Safety: Why NEVER use `gets()`\n`gets()` was officially removed from C11 because it does not accept a buffer size, causing endless buffer overflow security breaches. Always use `fgets(buffer, sizeof(buffer), filePtr)`!",
    "codeSnippet": "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    const char *filename = \"saksham_demo.txt\";\n\n    // 1. Writing to a file\n    FILE *fp = fopen(filename, \"w\");\n    if (fp == NULL) {\n        perror(\"Failed to open file for writing\");\n        return 1;\n    }\n    fputs(\"SakshamXTech C Academy - Lecture 25\\n\", fp);\n    fputs(\"Operating Systems and Systems Engineering.\\n\", fp);\n    fclose(fp);\n\n    // 2. Reading line-by-line using fgets\n    fp = fopen(filename, \"r\");\n    if (fp == NULL) {\n        perror(\"Failed to open file for reading\");\n        return 1;\n    }\n\n    char line[128];\n    printf(\"--- File Contents Read Back ---\\n\");\n    while (fgets(line, sizeof(line), fp) != NULL) {\n        printf(\"> %s\", line);\n    }\n    fclose(fp);\n\n    // Clean up demo file\n    remove(filename);\n\n    return 0;\n}",
    "expectedOutput": "--- File Contents Read Back ---\n> SakshamXTech C Academy - Lecture 25\n> Operating Systems and Systems Engineering.",
    "practiceQuestions": [
      {
        "question": "Write a program to count the number of characters and lines in a text file using fgetc().",
        "hint": "Loop with int ch = fgetc(fp); while (ch != EOF) and increment newline counter when ch == '\\n'.",
        "solutionCode": "#include <stdio.h>\n\nint main(void) {\n    FILE *fp = fopen(\"test.txt\", \"w\");\n    fputs(\"Line 1\\nLine 2\\nLine 3\\n\", fp);\n    fclose(fp);\n\n    fp = fopen(\"test.txt\", \"r\");\n    int lines = 0, chars = 0, ch;\n    while ((ch = fgetc(fp)) != EOF) {\n        chars++;\n        if (ch == '\\n') lines++;\n    }\n    fclose(fp);\n    remove(\"test.txt\");\n    printf(\"Lines: %d, Characters: %d\\n\", lines, chars);\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What special sentinel value does fgetc() return when it reaches the end of a file or encounters an error?",
        "options": [
          "NULL",
          "0",
          "EOF (-1)",
          "\\0"
        ],
        "correctIndex": 2,
        "explanation": "fgetc returns an int containing the EOF constant (typically -1) when end-of-file is reached."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-26",
    "dayNumber": 26,
    "title": "Formatted File I/O: fprintf, fscanf, perror & errno Diagnostics",
    "slug": "day-26-formatted-io-and-errno",
    "summary": "Structured CSV file parsing, writing formatted logs, inspecting system error numbers with errno and strerror.",
    "durationMinutes": 36,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 26: Formatted File I/O & System Error Handling\n\nParsing and generating structured configurations (CSV, TSV, key-value logs) is a daily task in systems programming.\n\n---\n\n## Formatted File Functions\n- `fprintf(fp, format, ...)`: Formatted output directly to stream.\n- `fscanf(fp, format, ...)`: Parses formatted patterns from stream.\n\n### Defensive Engineering: `errno` and `perror()`\nWhen system calls fail, the C runtime sets a thread-local global integer: `errno` (from `<errno.h>`).\n`perror(\"Custom Tag\")` prints your custom message followed by the human-readable explanation of `errno` (e.g. \"No such file or directory\", \"Permission denied\").",
    "codeSnippet": "#include <stdio.h>\n#include <errno.h>\n#include <string.h>\n\ntypedef struct {\n    char username[32];\n    int score;\n    float rating;\n} UserRecord;\n\nint main(void) {\n    const char *csvFile = \"leaderboard.csv\";\n\n    // Write formatted records\n    FILE *fp = fopen(csvFile, \"w\");\n    if (!fp) {\n        perror(\"Error creating CSV\");\n        return 1;\n    }\n    fprintf(fp, \"Aarav,98,4.9\\n\");\n    fprintf(fp, \"Sneha,95,4.8\\n\");\n    fclose(fp);\n\n    // Read and parse formatted records\n    fp = fopen(csvFile, \"r\");\n    if (!fp) {\n        perror(\"Error opening CSV\");\n        return 1;\n    }\n\n    UserRecord u;\n    printf(\"--- Parsed Records ---\\n\");\n    while (fscanf(fp, \"%31[^,],%d,%f\\n\", u.username, &u.score, &u.rating) == 3) {\n        printf(\"User: %-10s | Score: %3d | Rating: %.1f\\n\", \n               u.username, u.score, u.rating);\n    }\n    fclose(fp);\n    remove(csvFile);\n\n    return 0;\n}",
    "expectedOutput": "--- Parsed Records ---\nUser: Aarav      | Score:  98 | Rating: 4.9\nUser: Sneha      | Score:  95 | Rating: 4.8",
    "practiceQuestions": [
      {
        "question": "Demonstrate how to catch a failed fopen on a non-existent file and print the exact system error description using strerror(errno).",
        "hint": "#include <errno.h> and #include <string.h>",
        "solutionCode": "#include <stdio.h>\n#include <errno.h>\n#include <string.h>\n\nint main(void) {\n    FILE *fp = fopen(\"/non_existent_file_xyz.txt\", \"r\");\n    if (fp == NULL) {\n        printf(\"System Errno: %d (%s)\\n\", errno, strerror(errno));\n    }\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What return value from fscanf indicates that exactly two format specifiers were successfully parsed?",
        "options": [
          "0",
          "1",
          "2",
          "EOF"
        ],
        "correctIndex": 2,
        "explanation": "fscanf returns the total number of successfully matched and assigned input items."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-27",
    "dayNumber": 27,
    "title": "Binary File I/O: fread, fwrite, fseek, ftell & Serialization",
    "slug": "day-27-binary-file-io",
    "summary": "Direct raw byte disk serialization: fread, fwrite, random file seeks with fseek, and computing file size with ftell.",
    "durationMinutes": 42,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 27: Binary File I/O & Serialization\n\nText files convert numbers into human-readable ASCII strings (e.g., `12345678` takes 8 bytes of ASCII text). Binary files write the raw 4-byte memory image directly to disk, delivering **massive speed and zero conversion overhead**.\n\n---\n\n## The Binary Duo\n- `size_t fwrite(const void *ptr, size_t size, size_t count, FILE *stream)`\n- `size_t fread(void *ptr, size_t size, size_t count, FILE *stream)`\n\n### Random Access & Seeking\n- `fseek(fp, offset, SEEK_SET)`: Seek relative to beginning of file.\n- `fseek(fp, offset, SEEK_CUR)`: Seek relative to current head position.\n- `fseek(fp, offset, SEEK_END)`: Seek relative to end of file.\n- `long ftell(fp)`: Returns current byte offset of file head (used to get file sizes!).",
    "codeSnippet": "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct {\n    int id;\n    double timestamp;\n    char payload[16];\n} TelemetryPacket;\n\nint main(void) {\n    const char *binPath = \"telemetry.bin\";\n    TelemetryPacket tx = {101, 1729000.50, \"PACKET_OK\"};\n\n    // 1. Write raw binary struct directly to disk\n    FILE *fp = fopen(binPath, \"wb\");\n    fwrite(&tx, sizeof(TelemetryPacket), 1, fp);\n    fclose(fp);\n\n    // 2. Compute exact file byte size using fseek & ftell\n    fp = fopen(binPath, \"rb\");\n    fseek(fp, 0, SEEK_END);\n    long fileSize = ftell(fp);\n    rewind(fp); // Return to beginning\n\n    // 3. Read back into a clean struct\n    TelemetryPacket rx;\n    fread(&rx, sizeof(TelemetryPacket), 1, fp);\n    fclose(fp);\n\n    printf(\"Binary File Size on Disk: %ld bytes\\n\", fileSize);\n    printf(\"Read Back ID:      %d\\n\", rx.id);\n    printf(\"Read Back Time:    %.2f\\n\", rx.timestamp);\n    printf(\"Read Back Payload: %s\\n\", rx.payload);\n\n    remove(binPath);\n    return 0;\n}",
    "expectedOutput": "Binary File Size on Disk: 32 bytes\nRead Back ID:      101\nRead Back Time:    1729000.50\nRead Back Payload: PACKET_OK",
    "practiceQuestions": [
      {
        "question": "Write a function computeFileSize(const char *filename) that returns the total size in bytes using fseek and ftell.",
        "hint": "fseek(fp, 0, SEEK_END); long size = ftell(fp);",
        "solutionCode": "#include <stdio.h>\n\nlong computeFileSize(const char *filename) {\n    FILE *fp = fopen(filename, \"rb\");\n    if (!fp) return -1;\n    fseek(fp, 0, SEEK_END);\n    long size = ftell(fp);\n    fclose(fp);\n    return size;\n}\n\nint main(void) {\n    printf(\"Function compiled cleanly!\\n\");\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "Which fseek origin constant is used to position the file head relative to the very end of the file?",
        "options": [
          "SEEK_START",
          "SEEK_SET",
          "SEEK_CUR",
          "SEEK_END"
        ],
        "correctIndex": 3,
        "explanation": "SEEK_END sets the file position relative to the end of the file."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-28",
    "dayNumber": 28,
    "title": "Preprocessor Directives, Macros & Multi-File Architecture",
    "slug": "day-28-preprocessor-and-multi-file-projects",
    "summary": "Header guards (#ifndef), parameterized macros, inline code generation, and multi-file architecture (.h and .c).",
    "durationMinutes": 35,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 28: Preprocessor & Multi-File Architecture\n\nLarge production C applications are never written in a single file. They are divided into reusable modules:\n- Header files (`.h`): Declarations, interfaces, macro constants, and struct definitions.\n- Implementation files (`.c`): Private logic and function definitions.\n\n---\n\n## 1. Header Guards\nWithout header guards, including the same header twice causes \"Redefinition of struct/type\" compilation errors:\n```c\n#ifndef MY_MODULE_H\n#define MY_MODULE_H\n\n// Declarations here...\n\n#endif // MY_MODULE_H\n```\n\n## 2. Macro Hazards & Safe Parentheses\nAlways wrap macro parameters in parentheses to prevent operator precedence bugs!\n```c\n#define BAD_SQUARE(x)  x * x        // BAD: BAD_SQUARE(1 + 2) -> 1 + 2 * 1 + 2 = 5!\n#define SAFE_SQUARE(x) ((x) * (x))  // SAFE: ((1 + 2) * (1 + 2)) = 9\n```",
    "codeSnippet": "#include <stdio.h>\n\n#define MAX(a, b) (((a) > (b)) ? (a) : (b))\n#define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))\n#define STRINGIFY(x) #x\n\nint main(void) {\n    int x = 25, y = 40;\n    printf(\"Max of %d and %d: %d\\n\", x, y, MAX(x, y));\n\n    int list[] = {4, 8, 15, 16, 23, 42};\n    printf(\"Array element count: %zu\\n\", ARRAY_SIZE(list));\n\n    printf(\"Stringified macro: %s\\n\", STRINGIFY(SakshamXTech 2026));\n\n    return 0;\n}",
    "expectedOutput": "Max of 25 and 40: 40\nArray element count: 6\nStringified macro: SakshamXTech 2026",
    "practiceQuestions": [
      {
        "question": "Write a parameterized macro CLAMP(val, min, max) that ensures val stays between min and max.",
        "hint": "Use nested ternary operators: ((val) < (min) ? (min) : ((val) > (max) ? (max) : (val)))",
        "solutionCode": "#include <stdio.h>\n\n#define CLAMP(v, lo, hi) (((v) < (lo)) ? (lo) : (((v) > (hi)) ? (hi) : (v)))\n\nint main(void) {\n    printf(\"Clamped 150 [0, 100]: %d\\n\", CLAMP(150, 0, 100));\n    printf(\"Clamped -15 [0, 100]: %d\\n\", CLAMP(-15, 0, 100));\n    printf(\"Clamped 50  [0, 100]: %d\\n\", CLAMP(50, 0, 100));\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What is the preprocessor stringification operator that converts a macro argument into a quoted string literal?",
        "options": [
          "##",
          "#",
          "$",
          "@"
        ],
        "correctIndex": 1,
        "explanation": "The single hash (#) preprocessor operator stringifies the token passed into the macro."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-29",
    "dayNumber": 29,
    "title": "Dynamic Data Structures: Singly Linked List from Scratch",
    "slug": "day-29-singly-linked-list",
    "summary": "Master node self-referential structs, head/tail insertion, node traversal, node deletion, and freeList heap deallocation.",
    "durationMinutes": 45,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 29: Dynamic Data Structures — Singly Linked List\n\nArrays suffer from fixed sizes and expensive O(N) insertions. A **Linked List** is a dynamic collection of disjoint nodes connected by memory pointers.\n\n---\n\n## Linked List Node Anatomy\n```\n   ┌───────────────┐      ┌───────────────┐      ┌───────────────┐\n   │ Data: 10      │      │ Data: 20      │      │ Data: 30      │\n   │ Next: 0x2000  │ ───► │ Next: 0x3000  │ ───► │ Next: NULL    │\n   └───────────────┘      └───────────────┘      └───────────────┘\n   [ Head: 0x1000 ]\n```\n\n### Fundamental Operations\n- Insertion at Head: O(1) constant time!\n- Traversal & Search: O(N) linear time.\n- Node Memory Deallocation: Crucial! You must free every individual node to prevent memory leaks.",
    "codeSnippet": "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int data;\n    struct Node *next;\n} Node;\n\nvoid insertAtHead(Node **head, int value) {\n    Node *newNode = (Node*)malloc(sizeof(Node));\n    if (!newNode) return;\n    newNode->data = value;\n    newNode->next = *head;\n    *head = newNode;\n}\n\nvoid printList(const Node *head) {\n    const Node *curr = head;\n    printf(\"List: \");\n    while (curr != NULL) {\n        printf(\"[%d] -> \", curr->data);\n        curr = curr->next;\n    }\n    printf(\"NULL\\n\");\n}\n\nvoid freeList(Node *head) {\n    Node *curr = head;\n    while (curr != NULL) {\n        Node *next = curr->next;\n        free(curr);\n        curr = next;\n    }\n}\n\nint main(void) {\n    Node *head = NULL;\n\n    insertAtHead(&head, 30);\n    insertAtHead(&head, 20);\n    insertAtHead(&head, 10);\n\n    printList(head);\n\n    freeList(head);\n    head = NULL;\n    printf(\"List memory safely freed!\\n\");\n\n    return 0;\n}",
    "expectedOutput": "List: [10] -> [20] -> [30] -> NULL\nList memory safely freed!",
    "practiceQuestions": [
      {
        "question": "Write a function int searchList(const Node *head, int target) that returns 1 if target is present, 0 otherwise.",
        "hint": "Loop through nodes until curr == NULL. If curr->data == target return 1.",
        "solutionCode": "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node { int data; struct Node *next; } Node;\n\nint searchList(const Node *head, int target) {\n    const Node *curr = head;\n    while (curr != NULL) {\n        if (curr->data == target) return 1;\n        curr = curr->next;\n    }\n    return 0;\n}\n\nint main(void) {\n    printf(\"Search function compiled cleanly!\\n\");\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What is the time complexity of inserting a new node at the front (head) of a singly linked list?",
        "options": [
          "O(N)",
          "O(log N)",
          "O(1)",
          "O(N^2)"
        ],
        "correctIndex": 2,
        "explanation": "Inserting at head only requires creating the node, setting newNode->next = head, and updating head = newNode, which is O(1) constant time."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  },
  {
    "id": "c-30",
    "dayNumber": 30,
    "title": "Command-Line Arguments (argc, argv), POSIX Signals & Mini CLI Tool",
    "slug": "day-30-cli-arguments-and-signals",
    "summary": "The grand finale: build a production CLI tool parsing argc/argv flags, intercepting POSIX signals (SIGINT Ctrl+C), and exit codes.",
    "durationMinutes": 45,
    "youtubeVideoId": "ZnL2ZK0-KHg",
    "content": "# Day 30: Command-Line Arguments, Signals & Capstone Project!\n\nCongratulations on reaching Day 30 of the SakshamXTech C Programming Academy! You now possess deep systems programming fluency.\n\n---\n\n## 1. Command-Line Arguments: `argc` & `argv`\n```c\nint main(int argc, char *argv[])\n```\n- `argc` (Argument Count): Number of arguments passed to the program (always >= 1, since `argv[0]` is the executable path).\n- `argv` (Argument Vector): Array of null-terminated C string pointers (`char*`).\n\n## 2. Catching POSIX Signals (`<signal.h>`)\nWhen a user presses `Ctrl + C`, the OS kernel dispatches a `SIGINT` signal to your process. Using `signal(SIGINT, handler)`, you can catch it and gracefully flush logs, close sockets, and clean up resources before exiting!",
    "codeSnippet": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nvoid printHelp(const char *progName) {\n    printf(\"Usage: %s [options]\\n\", progName);\n    printf(\"Options:\\n\");\n    printf(\"  --help        Display this help message\\n\");\n    printf(\"  --version     Display SakshamXTech CLI version\\n\");\n    printf(\"  --greet NAME  Print customized engineering greeting\\n\");\n}\n\nint main(int argc, char *argv[]) {\n    printf(\"=========================================\\n\");\n    printf(\"  SakshamXTech Systems C CLI Tool v1.0   \\n\");\n    printf(\"=========================================\\n\");\n\n    if (argc < 2) {\n        printHelp(argv[0]);\n        return 0;\n    }\n\n    for (int i = 1; i < argc; i++) {\n        if (strcmp(argv[i], \"--help\") == 0) {\n            printHelp(argv[0]);\n            return 0;\n        } else if (strcmp(argv[i], \"--version\") == 0) {\n            printf(\"SakshamXTech C Engine Version: 2026.11-LTS (GCC)\\n\");\n            return 0;\n        } else if (strcmp(argv[i], \"--greet\") == 0 && i + 1 < argc) {\n            printf(\"Greetings, Engineer %s! Ready to hack systems code.\\n\", argv[i + 1]);\n            return 0;\n        }\n    }\n\n    printf(\"Unknown argument. Run '%s --help' for commands.\\n\", argv[0]);\n    return 1;\n}",
    "expectedOutput": "=========================================\n  SakshamXTech Systems C CLI Tool v1.0   \n=========================================\nUsage: ./program [options]\nOptions:\n  --help        Display this help message\n  --version     Display SakshamXTech CLI version\n  --greet NAME  Print customized engineering greeting",
    "practiceQuestions": [
      {
        "question": "Write a program that takes integer numbers as command-line arguments and prints their arithmetic average.",
        "hint": "Iterate from i = 1 to argc - 1 and convert strings to integers using atoi(argv[i]).",
        "solutionCode": "#include <stdio.h>\n#include <stdlib.h>\n\nint main(int argc, char *argv[]) {\n    if (argc < 2) {\n        printf(\"Usage: %s <num1> <num2> ...\\n\", argv[0]);\n        return 1;\n    }\n    double sum = 0;\n    for (int i = 1; i < argc; i++) {\n        sum += atoi(argv[i]);\n    }\n    printf(\"Average = %.2f\\n\", sum / (argc - 1));\n    return 0;\n}"
      }
    ],
    "quiz": [
      {
        "question": "What is always stored at argv[0] when a C executable is launched from the shell?",
        "options": [
          "The first argument passed by the user",
          "The path/name of the executing program itself",
          "NULL pointer",
          "The process ID (PID)"
        ],
        "correctIndex": 1,
        "explanation": "By standard convention, argv[0] contains the program name or invocation command."
      }
    ],
    "isPublished": true,
    "status": "published",
    "updatedAt": 1793978824268
  }
];
