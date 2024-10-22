# Project Deployment Steps

## File Structure:
### 1. `src/`
- Contains the UI files based on the React framework.
- 3 Pages are defined:
  - `SignIn`
  - `SignUp`
  - `UploadImage`

### 2. `config_files/`
- Contains the YAML files for:
  - CloudFormation-based resource deployment
  - CodePipeline-based CI/CD for the project

### 3. `buildspec.yml`
- Defines the configuration for build stages in CodePipeline.

---

## Steps to Deploy the Application:

### 1. Login to your AWS account.
- Navigate to the [AWS Management Console](https://aws.amazon.com/console/).
- Sign in using your AWS credentials.

### 2. Run `cloud_formation_05.yml` in CloudFormation
- In the AWS Management Console, navigate to the **CloudFormation** service.
- Click **Create Stack** and select **With new resources (standard)**.
- Upload the `cloud_formation_05.yml` file located in the `config_files/` directory.
- You might be prompted to enter the following parameters:
  - **GitHubOAuthToken**: [Reach out to Mayssa Elloumi @ melloumi@miu.edu]
  - **GitHubBranch**: [No modification required]
  - **FrontEndBucket**: [No modification required]

### 3. Run `cloudpipeline_01.yml` in CloudFormation
- This step will create the CodePipeline to handle the CI/CD for the frontend.
- Upload the `cloudpipeline_01.yml` file located in the `config_files/` directory.
- You might be prompted to enter the following parameter:
  - **ExistingBucketName**: [No manual input required]

### 4. Get the Frontend CDN URL from CloudFormation output
- Navigate to the **CloudFormation** stack outputs.
- Look for the **CloudFrontURL** parameter which contains the CDN URL for your frontend.
