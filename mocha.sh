# set -e

vagrant up win2012
vagrant winrm win2012 -c ". C:\\vagrant\\vagrant\\node-setup.bat | Write-Output"
vagrant winrm win2012 -c ". C:\\vagrant\\vagrant\\run-tests.bat | Write-Output"
vagrant halt win2012
