# Slope Search
A web application allowing users to search, filter, and favorite ski resorts around the world. Using data from openskimap.org.

## Local Installation Instructions
To build the database from scratch, a `createTables.sql` file is available inside the `sql` folder. This file uses absolute paths, so they must be adjusted to the location of your cleaned data. 

The data is sourced from [openskimap.org](https://openskimap.org/) and the `ski_areas.csv` and `runs.csv` are cleaned in the `/notebook/clean_data.ipynb` Jupyter notebook. A `data` folder is ignored by the `.gitignore` file, but can be recreated locally for convenience.

Additionally, you may choose to use a virtual environment if you don't want pandas to exist in you global Python packages. You can activate a virtual environment, or just use your global one, and install the dependencies by navigating into the notebook folder and running `pip install -r requirements.txt`.

Then, running the Jupyter notebook will clean your data and generate new csv files representing each table that will be inserted into the database using the statements in `/sql/createTables.sql`.