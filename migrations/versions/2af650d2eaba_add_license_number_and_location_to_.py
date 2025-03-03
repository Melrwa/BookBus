from alembic import op
import sqlalchemy as sa

def upgrade():
    # Step 1: Add the columns as nullable
    op.add_column('companies', sa.Column('license_number', sa.String(length=50), nullable=True))
    op.add_column('companies', sa.Column('location', sa.String(length=100), nullable=True))

    # Step 2: Populate existing rows with a default value for license_number
    op.execute("UPDATE companies SET license_number = 'DEFAULT_LICENSE' WHERE license_number IS NULL;")

    # Step 3: Alter the column to be NOT NULL
    op.alter_column('companies', 'license_number', nullable=False)

def downgrade():
    # Drop the columns during downgrade
    op.drop_column('companies', 'location')
    op.drop_column('companies', 'license_number')