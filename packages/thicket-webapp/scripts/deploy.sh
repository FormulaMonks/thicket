yarn build
s3-deploy './build/**' --cwd './build/' --region us-west-2 --bucket thicket.citrusbyte.com
