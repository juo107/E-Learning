-- Sample Categories Data with Hierarchical Structure
DECLARE @WebDevId UNIQUEIDENTIFIER = NEWID();
DECLARE @MobileDevId UNIQUEIDENTIFIER = NEWID();
DECLARE @DataScienceId UNIQUEIDENTIFIER = NEWID();
DECLARE @CloudId UNIQUEIDENTIFIER = NEWID();
DECLARE @DevOpsId UNIQUEIDENTIFIER = NEWID();
DECLARE @SecurityId UNIQUEIDENTIFIER = NEWID();
DECLARE @GameDevId UNIQUEIDENTIFIER = NEWID();
DECLARE @UIUXId UNIQUEIDENTIFIER = NEWID();
DECLARE @DatabaseId UNIQUEIDENTIFIER = NEWID();
DECLARE @ProgLangId UNIQUEIDENTIFIER = NEWID();

-- Root Categories (ParentCategoryId = NULL)
INSERT INTO Categories (Id, Name, Description, ParentCategoryId, CreatedAt, CreatedBy, IsDeleted)
VALUES 
    (@WebDevId, 'Web Development', 'Learn modern web development technologies', NULL, GETUTCDATE(), 'System', 0),
    (@MobileDevId, 'Mobile Development', 'Build mobile applications for iOS and Android', NULL, GETUTCDATE(), 'System', 0),
    (@DataScienceId, 'Data Science', 'Master data analysis and machine learning', NULL, GETUTCDATE(), 'System', 0),
    (@CloudId, 'Cloud Computing', 'AWS, Azure, and Google Cloud Platform', NULL, GETUTCDATE(), 'System', 0),
    (@DevOpsId, 'DevOps', 'CI/CD, Docker, Kubernetes, and infrastructure', NULL, GETUTCDATE(), 'System', 0),
    (@SecurityId, 'Cybersecurity', 'Security best practices and ethical hacking', NULL, GETUTCDATE(), 'System', 0),
    (@GameDevId, 'Game Development', 'Create games with Unity and Unreal Engine', NULL, GETUTCDATE(), 'System', 0),
    (@UIUXId, 'UI/UX Design', 'User interface and experience design', NULL, GETUTCDATE(), 'System', 0),
    (@DatabaseId, 'Database', 'SQL, NoSQL, and database administration', NULL, GETUTCDATE(), 'System', 0),
    (@ProgLangId, 'Programming Languages', 'Python, Java, C#, JavaScript fundamentals', NULL, GETUTCDATE(), 'System', 0);

-- Sub Categories for Web Development
INSERT INTO Categories (Id, Name, Description, ParentCategoryId, CreatedAt, CreatedBy, IsDeleted)
VALUES 
    (NEWID(), 'Frontend Development', 'HTML, CSS, JavaScript, React, Vue, Angular', @WebDevId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'Backend Development', 'Node.js, Python, PHP, Java, C# server-side', @WebDevId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'Full-Stack Development', 'Complete web applications frontend to backend', @WebDevId, GETUTCDATE(), 'System', 0);

-- Sub Categories for Mobile Development
INSERT INTO Categories (Id, Name, Description, ParentCategoryId, CreatedAt, CreatedBy, IsDeleted)
VALUES 
    (NEWID(), 'iOS Development', 'Swift, Objective-C, Xcode, iOS frameworks', @MobileDevId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'Android Development', 'Kotlin, Java, Android Studio, Material Design', @MobileDevId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'Cross-Platform', 'React Native, Flutter, Xamarin, Ionic', @MobileDevId, GETUTCDATE(), 'System', 0);

-- Sub Categories for Data Science
INSERT INTO Categories (Id, Name, Description, ParentCategoryId, CreatedAt, CreatedBy, IsDeleted)
VALUES 
    (NEWID(), 'Machine Learning', 'Algorithms, models, training, prediction', @DataScienceId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'Deep Learning', 'Neural networks, CNNs, RNNs, TensorFlow', @DataScienceId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'Data Analysis', 'Pandas, NumPy, visualization, statistics', @DataScienceId, GETUTCDATE(), 'System', 0);

-- Sub Categories for Cloud Computing
INSERT INTO Categories (Id, Name, Description, ParentCategoryId, CreatedAt, CreatedBy, IsDeleted)
VALUES 
    (NEWID(), 'AWS Services', 'Amazon Web Services, EC2, S3, Lambda', @CloudId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'Azure Services', 'Microsoft Azure, VMs, Storage, Functions', @CloudId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'Google Cloud', 'GCP, Compute Engine, Cloud Storage, Functions', @CloudId, GETUTCDATE(), 'System', 0);

-- Sub Categories for Programming Languages
INSERT INTO Categories (Id, Name, Description, ParentCategoryId, CreatedAt, CreatedBy, IsDeleted)
VALUES 
    (NEWID(), 'Python Programming', 'Python syntax, libraries, frameworks', @ProgLangId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'Java Programming', 'Java SE, Spring, enterprise development', @ProgLangId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'JavaScript Programming', 'ES6+, Node.js, frameworks, async programming', @ProgLangId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'C# Programming', '.NET, ASP.NET, Entity Framework, WPF', @ProgLangId, GETUTCDATE(), 'System', 0);

-- Get Sub-Category IDs for more specific course assignments
DECLARE @FrontendId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Frontend Development');
DECLARE @BackendId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Backend Development');
DECLARE @FullStackId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Full-Stack Development');
DECLARE @iOSId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'iOS Development');
DECLARE @AndroidId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Android Development');
DECLARE @CrossPlatformId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Cross-Platform');
DECLARE @MLId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Machine Learning');
DECLARE @DeepLearningId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Deep Learning');
DECLARE @DataAnalysisId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Data Analysis');
DECLARE @AWSId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'AWS Services');
DECLARE @AzureId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Azure Services');
DECLARE @PythonId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Python Programming');
DECLARE @JavaId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'Java Programming');
DECLARE @JSId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'JavaScript Programming');
DECLARE @CSharpId UNIQUEIDENTIFIER = (SELECT Id FROM Categories WHERE Name = 'C# Programming');

INSERT INTO Courses (Id, CourseCode, Title, Description, Price, DurationInMinutes, CategoryId, CreatedAt, CreatedBy, IsDeleted)
VALUES 
    -- Frontend Development Courses
    (NEWID(), 'FRONTEND_001', 'Complete React Development Bootcamp', 'Master React from basics to advanced concepts including hooks, context, and state management', 299.99, 480, @FrontendId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'FRONTEND_002', 'Vue.js 3 Complete Guide', 'Learn Vue.js 3 with Composition API, Vuex, and modern development practices', 199.99, 360, @FrontendId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'FRONTEND_003', 'Angular 15 Masterclass', 'Build enterprise applications with Angular 15, TypeScript, and RxJS', 349.99, 600, @FrontendId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'FRONTEND_004', 'Modern CSS and Sass', 'Advanced CSS techniques, Flexbox, Grid, and Sass preprocessing', 149.99, 240, @FrontendId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'FRONTEND_005', 'JavaScript ES6+ Mastery', 'Modern JavaScript features, async/await, modules, and best practices', 179.99, 300, @FrontendId, GETUTCDATE(), 'System', 0),
    
    -- Backend Development Courses
    (NEWID(), 'BACKEND_001', 'Node.js Backend Development', 'Create scalable server-side applications with Node.js, Express, and MongoDB', 249.99, 420, @BackendId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'BACKEND_002', 'Python Django Masterclass', 'Build web applications with Django, REST APIs, and PostgreSQL', 279.99, 480, @BackendId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'BACKEND_003', 'Spring Boot with Java', 'Enterprise Java development with Spring Boot, JPA, and microservices', 329.99, 540, @BackendId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'BACKEND_004', 'ASP.NET Core Web API', 'Build RESTful APIs with ASP.NET Core, Entity Framework, and SQL Server', 299.99, 450, @BackendId, GETUTCDATE(), 'System', 0),
    
    -- Full-Stack Development Courses
    (NEWID(), 'FULLSTACK_001', 'MERN Stack Development', 'Complete full-stack with MongoDB, Express, React, and Node.js', 499.99, 900, @FullStackId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'FULLSTACK_002', 'MEAN Stack Mastery', 'MongoDB, Express, Angular, and Node.js full-stack development', 449.99, 840, @FullStackId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'FULLSTACK_003', 'Django + React Full-Stack', 'Python Django backend with React frontend integration', 399.99, 720, @FullStackId, GETUTCDATE(), 'System', 0),
    
    -- iOS Development Courses
    (NEWID(), 'IOS_001', 'iOS Development with Swift', 'Build iOS applications using Swift and Xcode', 399.99, 720, @iOSId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'IOS_002', 'SwiftUI Masterclass', 'Modern iOS development with SwiftUI and Combine', 299.99, 480, @iOSId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'IOS_003', 'Core Data and iOS Persistence', 'Data persistence in iOS apps with Core Data', 199.99, 300, @iOSId, GETUTCDATE(), 'System', 0),
    
    -- Android Development Courses
    (NEWID(), 'ANDROID_001', 'Android Development with Kotlin', 'Develop Android apps using Kotlin and Android Studio', 329.99, 600, @AndroidId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'ANDROID_002', 'Jetpack Compose Mastery', 'Modern Android UI development with Jetpack Compose', 279.99, 450, @AndroidId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'ANDROID_003', 'Android Architecture Components', 'MVVM, LiveData, ViewModel, and Room database', 249.99, 360, @AndroidId, GETUTCDATE(), 'System', 0),
    
    -- Cross-Platform Development Courses
    (NEWID(), 'CROSS_001', 'Flutter Development Bootcamp', 'Build cross-platform mobile apps with Flutter and Dart', 279.99, 540, @CrossPlatformId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'CROSS_002', 'React Native Masterclass', 'Create native mobile apps using React Native and JavaScript', 229.99, 480, @CrossPlatformId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'CROSS_003', 'Xamarin.Forms Development', 'Cross-platform development with Xamarin and C#', 199.99, 360, @CrossPlatformId, GETUTCDATE(), 'System', 0),
    
    -- Machine Learning Courses
    (NEWID(), 'ML_001', 'Machine Learning with Python', 'Implement machine learning algorithms using scikit-learn and TensorFlow', 399.99, 720, @MLId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'ML_002', 'Scikit-Learn Mastery', 'Comprehensive guide to machine learning with scikit-learn', 299.99, 480, @MLId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'ML_003', 'Machine Learning for Business', 'Apply ML techniques to solve real business problems', 249.99, 360, @MLId, GETUTCDATE(), 'System', 0),
    
    -- Deep Learning Courses
    (NEWID(), 'DEEP_001', 'Deep Learning Fundamentals', 'Neural networks, CNNs, RNNs, and advanced deep learning techniques', 499.99, 900, @DeepLearningId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'DEEP_002', 'TensorFlow 2.0 Mastery', 'Build and deploy deep learning models with TensorFlow', 399.99, 720, @DeepLearningId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'DEEP_003', 'PyTorch for Deep Learning', 'Modern deep learning with PyTorch framework', 349.99, 600, @DeepLearningId, GETUTCDATE(), 'System', 0),
    
    -- Data Analysis Courses
    (NEWID(), 'ANALYSIS_001', 'Python for Data Science', 'Learn data analysis with Python, Pandas, NumPy, and Matplotlib', 199.99, 360, @DataAnalysisId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'ANALYSIS_002', 'Data Visualization with Tableau', 'Create compelling data visualizations and dashboards', 149.99, 240, @DataAnalysisId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'ANALYSIS_003', 'Pandas and NumPy Mastery', 'Advanced data manipulation and analysis with Python', 179.99, 300, @DataAnalysisId, GETUTCDATE(), 'System', 0),
    
    -- AWS Services Courses
    (NEWID(), 'AWS_001', 'AWS Solutions Architect', 'Design and deploy scalable applications on AWS', 599.99, 1200, @AWSId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'AWS_002', 'AWS Lambda and Serverless', 'Build serverless applications with AWS Lambda', 299.99, 480, @AWSId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'AWS_003', 'AWS EC2 and VPC', 'Virtual machines and networking on AWS', 249.99, 360, @AWSId, GETUTCDATE(), 'System', 0),
    
    -- Azure Services Courses
    (NEWID(), 'AZURE_001', 'Azure Fundamentals', 'Microsoft Azure cloud services and solutions', 299.99, 480, @AzureId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'AZURE_002', 'Azure Functions and Logic Apps', 'Serverless computing on Microsoft Azure', 279.99, 420, @AzureId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'AZURE_003', 'Azure DevOps and CI/CD', 'DevOps practices with Azure DevOps', 329.99, 540, @AzureId, GETUTCDATE(), 'System', 0),
    
    -- Programming Language Courses
    (NEWID(), 'PYTHON_001', 'Python Programming Bootcamp', 'Complete Python programming from basics to advanced', 199.99, 480, @PythonId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'PYTHON_002', 'Python Web Scraping', 'Extract data from websites using BeautifulSoup and Scrapy', 149.99, 240, @PythonId, GETUTCDATE(), 'System', 0),
    
    (NEWID(), 'JAVA_001', 'Java Programming Mastery', 'Complete Java development from basics to enterprise', 299.99, 600, @JavaId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'JAVA_002', 'Spring Framework Bootcamp', 'Enterprise Java development with Spring ecosystem', 399.99, 720, @JavaId, GETUTCDATE(), 'System', 0),
    
    (NEWID(), 'JS_001', 'JavaScript ES6+ Mastery', 'Modern JavaScript features and best practices', 179.99, 360, @JSId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'JS_002', 'Node.js Backend Development', 'Server-side JavaScript with Node.js and Express', 249.99, 480, @JSId, GETUTCDATE(), 'System', 0),
    
    (NEWID(), 'CSHARP_001', 'C# Programming Fundamentals', 'Complete C# programming from basics to advanced', 229.99, 480, @CSharpId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'CSHARP_002', 'ASP.NET Core Web Development', 'Build web applications with ASP.NET Core', 299.99, 540, @CSharpId, GETUTCDATE(), 'System', 0),
    
    -- DevOps Courses
    (NEWID(), 'DEVOPS_001', 'CI/CD with Jenkins', 'Automate build, test, and deployment pipelines', 199.99, 300, @DevOpsId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'DEVOPS_002', 'Infrastructure as Code', 'Terraform and Ansible for infrastructure automation', 329.99, 480, @DevOpsId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'DEVOPS_003', 'Monitoring and Logging', 'ELK Stack, Prometheus, and Grafana for observability', 249.99, 360, @DevOpsId, GETUTCDATE(), 'System', 0),
    
    -- Cybersecurity Courses
    (NEWID(), 'SECURITY_001', 'Ethical Hacking Fundamentals', 'Learn penetration testing and security assessment', 399.99, 600, @SecurityId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'SECURITY_002', 'Network Security', 'Protect networks from cyber threats and attacks', 299.99, 480, @SecurityId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'SECURITY_003', 'Cryptography and PKI', 'Encryption, digital signatures, and public key infrastructure', 249.99, 360, @SecurityId, GETUTCDATE(), 'System', 0),
    
    -- Game Development Courses
    (NEWID(), 'GAME_001', 'Unity 3D Game Development', 'Create 3D games with Unity and C#', 279.99, 540, @GameDevId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'GAME_002', 'Unreal Engine Blueprint', 'Visual scripting for game development', 199.99, 360, @GameDevId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'GAME_003', '2D Game Development', 'Build 2D games with Unity and C#', 149.99, 300, @GameDevId, GETUTCDATE(), 'System', 0),
    
    -- UI/UX Design Courses
    (NEWID(), 'UIUX_001', 'Figma Masterclass', 'Design user interfaces with Figma', 179.99, 300, @UIUXId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'UIUX_002', 'Adobe XD for UX Design', 'Create prototypes and user experiences', 199.99, 360, @UIUXId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'UIUX_003', 'User Research Methods', 'Conduct user research and usability testing', 149.99, 240, @UIUXId, GETUTCDATE(), 'System', 0),
    
    -- Database Courses
    (NEWID(), 'DB_001', 'SQL Mastery', 'Advanced SQL queries and database optimization', 199.99, 360, @DatabaseId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'DB_002', 'MongoDB NoSQL Database', 'Document-based database design and queries', 179.99, 300, @DatabaseId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'DB_003', 'PostgreSQL Administration', 'Database administration and performance tuning', 299.99, 480, @DatabaseId, GETUTCDATE(), 'System', 0),
    
    -- Programming Languages Courses
    (NEWID(), 'PROG_001', 'Python Programming Bootcamp', 'Learn Python from beginner to advanced', 149.99, 300, @ProgLangId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'PROG_002', 'Java Enterprise Development', 'Enterprise applications with Java Spring', 399.99, 720, @ProgLangId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'PROG_003', 'C# Advanced Programming', 'Advanced C# features and .NET development', 279.99, 480, @ProgLangId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'PROG_004', 'JavaScript ES6+ Mastery', 'Modern JavaScript features and best practices', 199.99, 360, @ProgLangId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'PROG_005', 'Go Programming Language', 'Build scalable applications with Go', 229.99, 420, @ProgLangId, GETUTCDATE(), 'System', 0);

-- Additional courses with different price ranges for testing filters
INSERT INTO Courses (Id, CourseCode, Title, Description, Price, DurationInMinutes, CategoryId, CreatedAt, CreatedBy, IsDeleted)
VALUES 
    -- Low price courses
    (NEWID(), 'BUDGET_001', 'HTML & CSS Basics', 'Learn the fundamentals of web markup and styling', 29.99, 120, @WebDevId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'BUDGET_002', 'JavaScript Fundamentals', 'Core JavaScript concepts and syntax', 39.99, 180, @ProgLangId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'BUDGET_003', 'Git Version Control', 'Learn Git and GitHub for version control', 19.99, 90, @DevOpsId, GETUTCDATE(), 'System', 0),
    
    -- High price premium courses
    (NEWID(), 'PREMIUM_001', 'Complete Software Engineering Bootcamp', 'Full-stack development, algorithms, system design', 999.99, 2000, @WebDevId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'PREMIUM_002', 'AI/ML Engineer Certification', 'End-to-end machine learning engineering', 1299.99, 2500, @DataScienceId, GETUTCDATE(), 'System', 0),
    (NEWID(), 'PREMIUM_003', 'Cloud Architect Master Program', 'Multi-cloud architecture and design patterns', 1499.99, 3000, @CloudId, GETUTCDATE(), 'System', 0);

-- Some soft-deleted courses for testing
INSERT INTO Courses (Id, CourseCode, Title, Description, Price, DurationInMinutes, CategoryId, CreatedAt, CreatedBy, IsDeleted, DeletedAt, DeletedBy)
VALUES 
    (NEWID(), 'OLD_001', 'Legacy PHP Development', 'Old PHP course - deprecated', 99.99, 240, @WebDevId, DATEADD(day, -30, GETUTCDATE()), 'System', 1, DATEADD(day, -5, GETUTCDATE()), 'System'),
    (NEWID(), 'OLD_002', 'Flash Development', 'Adobe Flash development - discontinued', 49.99, 180, @WebDevId, DATEADD(day, -60, GETUTCDATE()), 'System', 1, DATEADD(day, -10, GETUTCDATE()), 'System');

PRINT 'Sample data inserted successfully!';
PRINT 'Categories: 10';
PRINT 'Courses: 40+ (including budget, premium, and deleted courses)';
